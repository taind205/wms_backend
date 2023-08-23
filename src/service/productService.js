import db from "../db/models"
import { Op, fn, col } from "sequelize";


// const getAllUser = async () => {
//     const users = await db.User.findAll();
//     return users
// }
const loadProductTags = async (query) => {
    let list=[];
    try{
        list = await db.Tag.findAll({order: [['updatedAt', 'ASC']], attributes:['id','name','description','CategoryId'],
                    //where:{ProductId:query.id},
                    include: [ {model:db.Product, attributes:[],where:{ id:query.id }}],
                    }); }
    catch(e) {
        console.error(e);
        return {message:"error occured"}; }
    return list;
}

const loadProductPrices = async (query) =>{
    let list =[];
    try{
        list = await db.ProductPrice.findAll({order: [['id', 'DESC']],
             attributes:['price','createdAt'], where:{ProductId:query.id}})
            }
    catch(e) {
        console.error(e);
        return {message:"error occured"}; }
    return list;
    
}

const getCurrentProductPrices = async(id) => {
    const current_price = await db.ProductPrice.findOne({order: [['id', 'DESC']],
                attributes:['price'], where:{ProductId:id}})
    console.log('currentprice::::::',Number(current_price?.price));
    return Number(current_price?.price||0);
}

const loadListProduct = async (query) => {
    const load_num = query.n || 0;
    let filter = {};
    let order = ''
    query.name? filter.name={[Op.like]: '%' + query.name + '%'} : {};
    query.description? filter.description={[Op.like]: '%' + query.description + '%'} : {};
    // query.address? filter.address={[Op.like]: '%' + query.address + '%'} : {};

    //Sequelize use Inner Join if use where: x_filt inside 'include' key
    // const fullName_filt = query.modifiedBy ? {model:db.User, attributes:["fullname"], where:{ fullname:{[Op.like]: '%' + query.modifiedBy + '%'} }}
    //                          : {model:db.User, attributes:["fullname"]};
    const loadsize=4;
    let list=[];
    try{
        // if(accountID) {
        list = await db.Product.findAll({order: [[query.order || 'updatedAt', 'DESC']], 
                    attributes:["id","name",'description','shelfLife','StatusId'],
                    where:filter,
                    // include: [ fullName_filt],
                    limit:loadsize, offset:loadsize*load_num});
        // } else {
        //     acc = await db.Account.findAll({order: [['createdAt', 'DESC']], attributes:["id","createdAt",],
        //     include: [ username_filt,
        //                 role_filt,
        //                 status_filt],
        //     limit:loadsize, offset:loadsize*load_num}); 
        // }
    }
    catch(e)
    {
        console.error(e);
        return {message:"error occured"};
    }
    return list;
}

const addProduct = async (info,img_path) => {
    info.image = img_path
    console.log("add product:", info);

    try{
        const new_record = await db.Product.create(info);
        const new_record2 = await db.ProductPrice.create({ProductId:new_record.id, price:info.price, UserId:info.UserId});
        for(const tag of info.tags.split(',')){
            console.log('add', tag);
            const new_record2 = await db.ProductTag.create({ProductId:new_record.id, TagId:tag});
        }
        console.log('finish add product',new_record,new_record2);
    }
    catch(e)
    {
        console.error(e);
        return false;
    }

    return true;
}

const updateProduct = async (update_info,img_path) => {
    img_path? update_info.image = img_path : {};
    console.log("update product:", update_info);

    try{
        // const warehouse = await db.Warehouse.findOne({ where: { id:update_info.id }, attributes:["id","image"]});
        // delete old image file from path
        const updated_record = await db.Product.update(update_info, { where: { id:update_info.id }});
        if(update_info.price){
            const current_price = await db.ProductPrice.findOne({order: [['id', 'DESC']],
                attributes:['price'], where:{ProductId:update_info.id}})
            console.log('currentprice::::::',current_price?.price);
            if(Number(current_price?.price||0)!=Number(update_info.price))
                await db.ProductPrice.create({ProductId:update_info.id, price:update_info.price, UserId:update_info.UserId});
        }

        // const new_record2 = await db.ProductPrice.create({ProductId:new_record.id, price:info.price, UserId:info.UserId});
        if(update_info.deprecated_tags)
            for(const tag of update_info.deprecated_tags.split(',')){
                console.log('delete', tag);
                await db.ProductTag.destroy({where:{ProductId:update_info.id, TagId:tag}}); }
        if(update_info.new_tags)
            for(const tag of update_info.new_tags.split(',')){
                console.log('add', tag);
                await db.ProductTag.create({ProductId:update_info.id, TagId:tag});}
        console.log('finish update product', updated_record);
    }
    catch(e)
    {
        console.error(e);
        return false;
    }

    return true;
}

const getProductImagePath = async (id) => {
    
    console.log("get product ImagePath:", id);
    
    try{
        const record = await db.Product.findOne({attributes:["image"],
            where:{ id: id } });
        console.log('path',record) 
        return record?.image||'';
    }
    catch(e)
    {
        console.error(e);
        return '';
    }
}

const loadCategory = async () => {
    // const load_num = query.n || 0;
    // let filter = {};
    // query.name? filter.name={[Op.like]: '%' + query.name + '%'} : {};
    // query.description? filter.description={[Op.like]: '%' + query.description + '%'} : {};
    // query.CategoryID? filter.CategoryID=query.CategoryID : {};
    // const loadsize=5;
    let list=[];
    try{
        list = await db.Category.findAll({attributes:['id','name','description'], limit:99}); }
    catch(e) {
        console.error(e);
        return {message:"error occured"}; }
    return list;
}

const loadTags = async (query) => {
    const load_num = query.n || 0;
    let filter = {};
    query.name? filter.name={[Op.like]: '%' + query.name + '%'} : {};
    query.description? filter.description={[Op.like]: '%' + query.description + '%'} : {};
    query.CategoryId? filter.CategoryId=query.CategoryId : {};
    const loadsize=5;
    let list=[];
    try{
        list = await db.Tag.findAll({order: [['updatedAt', 'DESC']], attributes:['id','name','description','CategoryId'],
                    where:filter,
                    // include: [ fullName_filt],
                    limit:loadsize, offset:loadsize*load_num}); }
    catch(e) {
        console.error(e);
        return {message:"error occured"}; }
    return list;
}

const addTag = async (info) => {
    console.log("add product tag:", info);

    try{
        const new_record = await db.Tag.create(info);
        console.log('finish add product tag',new_record);
    }
    catch(e)
    {
        console.error(e);
        return false;
    }

    return true;
}

const updateTag = async (update_info) => {
    console.log("update product tag:", update_info);
    try{
        const updated_record = await db.Tag.update(update_info, { where: { id:update_info.id }});
        console.log('finish update product tag', updated_record);
    }
    catch(e)
    {
        console.error(e);
        return false;
    }

    return true;
}

const createImport = async (info) => {
    info.StatusId=1;
    console.log("create import:", info, info.list);

    try{
        const new_record = await db.Import.create(info);
        for(const product of info.list){
            product.ImportId = new_record.id;
            console.log('add', product);
            const new_record2 = await db.ImportProduct.create(product);
        }
        console.log('finish creating import',new_record);
    }
    catch(e)
    {
        console.error(e);
        return false;
    }
    return true;
}

const loadImports = async (query) => {
    const load_num = query.n || 0;
    let filter = {};
    query.note? filter.note={[Op.like]: '%' + query.note + '%'} : {};
    query.StatusId? filter.StatusId=query.StatusId : {};
    query.WarehouseId? filter.WarehouseId=query.WarehouseId : {};
    query.createdBy? filter.createdBy=query.createdBy : {};
    const loadsize=5;
    let list=[];
    try{
        list = await db.Import.findAll({order: [['updatedAt', 'DESC']], attributes:['id','note','createdAt','importDate','StatusId','WarehouseId'],
                    where:filter,
                    include: [ {model:db.User, as:'createdUser', attributes:["fullName"]},
                                {model:db.User, as:'approvedUser', attributes:["fullName"]},
                                {model:db.Warehouse, attributes:['id','address','name','description']}],
                    limit:loadsize, offset:loadsize*load_num}); }
    catch(e) {
        console.error(e);
        return {message:"error occured"}; }
    return list;
}

const loadImportDetails = async (query) => {
    let list=[];
    try{
        list = await db.ImportProduct.findAll({attributes:['id','ProductId','expiryDate','productNumber',],
                    where:{ImportId:query.id},
                    include: [ {model:db.Product, attributes:['name'],where:{}}],
                    }); }
    catch(e) {
        console.error(e);
        return {message:"error occured"}; }
    return list;
}

const loadProductBatchesbyProductId = async (query) => {
    const load_num = query.n || 0;
    let filter = {ProductId: query.id, inventory:{[Op.gt]: 0}, '$Import.Warehouse.name$': { [Op.like]: '%' + (query.WarehouseName||'') + '%' }};
    let Warehouse_filter = {};
    query.WarehouseName? Warehouse_filter.name={[Op.like]: '%' + query.WarehouseName + '%'} : {};
    const import_model = {model:db.Import, attributes:['id'], include: [{model:db.Warehouse, attributes:['id', 'name']}]};
    // query.description? filter.description={[Op.like]: '%' + query.description + '%'} : {};
    // query.CategoryID? filter.CategoryID=query.CategoryID : {};
    const loadsize=3;
    let list=[];
    try{
        list = await db.ImportProduct.findAll({order: [['expiryDate', 'ASC']], attributes:['id','expiryDate','inventory'],
                    where:filter,
                    include: [import_model],
                    limit:loadsize, offset:loadsize*load_num}); }
    catch(e) {
        console.error(e);
        return {message:"error occured"}; }
    return list;
}

const createExport = async (info) => {
    info.StatusId=1;
    console.log("create export:", info, info.list);

    let new_export_ids = {};
    try{
        for(const warehouse_id of info.list[0])
        {
            const new_record = await db.Export.create(Object.assign(info, {WarehouseId:warehouse_id}));
            new_export_ids[warehouse_id]=new_record.id;
            console.log('finish creating export', info);
        }
        for(const ep_detail of info.list[1]){
            ep_detail.ExportId = new_export_ids[ep_detail.WarehouseId];
            console.log('add', ep_detail);
            await db.ExportProduct.create(ep_detail);
        }
    }
    catch(e)
    {
        console.error(e);
        return false;
    }
    return true;
}

const loadExports = async (query) => {
    const load_num = query.n || 0;
    let filter = {};
    query.note? filter.note={[Op.like]: '%' + query.note + '%'} : {};
    query.StatusId? filter.StatusId=query.StatusId : {};
    query.WarehouseId? filter.WarehouseId=query.WarehouseId : {};
    query.createdBy? filter.createdBy=query.createdBy : {};
    const loadsize=5;
    let list=[];
    try{
        list = await db.Export.findAll({order: [['updatedAt', 'DESC']], attributes:['id','note','createdAt','exportDate','StatusId','WarehouseId','StoreId'],
                    where:filter,
                    include: [ {model:db.User, as:'createdUser', attributes:["fullName"]},
                                {model:db.User, as:'approvedUser', attributes:["fullName"]},
                                {model:db.Warehouse, attributes:['id','address','name','description']},
                                {model:db.Store, attributes:['id','address','name','description']}],
                    limit:loadsize, offset:loadsize*load_num}); }
    catch(e) {
        console.error(e);
        return {message:"error occured"}; }
    return list;
}

const loadExportDetails = async (query) => {
    let list=[];
    // const Export_fill = {model:db.Export, attributes:['id'], where:{id:query.id}};
    try{
        console.log(query);
        list = await db.ImportProduct.findAll({attributes:['id', 'ProductId','expiryDate'],
                    // where:{ExportId: query.id},
                    // through:{attributes: ['productNumber'],  where:{ExportId: Number(query.id)},},
                    // {model:db.Product, attributes:['name']}, 
                    include: [
                        {model:db.ExportProduct, attributes: ['productNumber'], where:{ExportId: query.id}},
                         {model:db.Product, attributes:['name']}
                    ],
                    }); }
    catch(e) {
        console.error(e);
        return {message:"error occured"}; }
    return list;
}

const getExpiryDateReport = async (query) => {
    // const load_num = query.n || 0;
    // let filter = {ProductId: query.id, inventory:{[Op.gt]: 0}, '$Import.Warehouse.name$': { [Op.like]: '%' + (query.WarehouseName||'') + '%' }};
    // let Warehouse_filter = {};
    // query.WarehouseName? Warehouse_filter.name={[Op.like]: '%' + query.WarehouseName + '%'} : {};
    // const import_model = {model:db.Import, attributes:['id'], include: [{model:db.Warehouse, attributes:['id', 'name']}]};
    // // query.description? filter.description={[Op.like]: '%' + query.description + '%'} : {};
    // // query.CategoryID? filter.CategoryID=query.CategoryID : {};
    // const loadsize=3;
    // let list=[];
    const cycle = query.cycle || (1000*60*60*24*15);//15days
    const cycleNumber = query.cycleNumber || 5;
    const product_incl = {model:db.Product, attributes:['name']};
    //const expiryDate_filter = {expiryDate:{[Op.between]:[query.startDate,query.endDate]}}
    let pbs_list=[];
    try{
        for (let i = 0; i < cycleNumber; i++)
        {
            // list = await db.ImportProduct.findAll({attributes:['id','expiryDate','inventory'],
            //         where:{expiryDate:{[Op.between]:[new Date(Date.now()+cycle*i),new Date(Date.now()+cycle*(i+1))]}},
            //         include: product_incl,}); 
            const startDate=new Date(Date.now()+cycle*i);
            const endDate = new Date(Date.now()+cycle*(i+1))
            const pbs = await db.ImportProduct.findAll({ attributes:['ProductId',
                [fn('sum', col('inventory')), 'totalInventory'],], 
                where:{expiryDate:{[Op.between]:[startDate,endDate]}},
                include: product_incl,
                group: ['ProductId'], }); 
            
            for(let pb of pbs)
            {
                pb.dataValues.price = await getCurrentProductPrices(pb.ProductId);
            }

            pbs_list.push({startDate:startDate,endDate:endDate,info:pbs});
        }
    }
        
    catch(e) {
        console.error(e);
        return {message:"error occured"}; }
    return pbs_list;
}

const getInventoryReport = async (query) => {
    // const load_num = query.n || 0;
    // let filter = {ProductId: query.id, inventory:{[Op.gt]: 0}, '$Import.Warehouse.name$': { [Op.like]: '%' + (query.WarehouseName||'') + '%' }};
    // let Warehouse_filter = {};
    // query.WarehouseName? Warehouse_filter.name={[Op.like]: '%' + query.WarehouseName + '%'} : {};
    const product_incl = {model:db.Product, attributes:['name']};
    // query.description? filter.description={[Op.like]: '%' + query.description + '%'} : {};
    // query.CategoryID? filter.CategoryID=query.CategoryID : {};
    // const loadsize=3;
    let expiryDate_filt = {};
    if(query.startDate && query.endDate) expiryDate_filt={expiryDate:{[Op.between]:[query.startDate,query.endDate]}};
    else{
    query.startDate? expiryDate_filt={expiryDate:{[Op.gte]:query.startDate}} :{};
    query.endDate? expiryDate_filt={expiryDate:{[Op.lte]:query.endDate}} :{};
    }

    let p_inv=[];
    let pbs=[];
    
    try{
        pbs = await db.ImportProduct.findAll({ attributes:['ProductId',
                [fn('sum', col('inventory')), 'totalInventory'],], 
                where:expiryDate_filt,
                include: product_incl,
                group: ['ProductId'], }); 
        
        for(let pb of pbs)
        {
            console.log('pbbbbbbbbbbbb', pb);
            pb.dataValues.price = await getCurrentProductPrices(pb.ProductId);
        }
                //order: [['expiryDate', 'ASC']], where:filter, include: [import_model], limit:loadsize, offset:loadsize*load_num
        // const ps = await db.Product.findAll({ attributes:['id','name'] }); 
        // for(const pb of pbs)
        // {
        //     if(p_inv[pb.ProductId])
        //         p_inv[pb.ProductId]=Number(p_inv[pb.ProductId])+Number(pb.inventory);
        //     else p_inv[pb.ProductId]=Number(pb.inventory);
        // }
        // for(let pb of pbs)
        // {   
        //     pb.name=ps.
        // }
    }
                catch(e) {
        console.error(e);
        return {message:"error occured"}; }
    return pbs;
}

module.exports = { addProduct, loadListProduct, getProductImagePath, updateProduct, 
                loadCategory, loadTags, addTag, updateTag, loadProductTags,
                createImport, loadImports, loadImportDetails, 
                loadProductBatchesbyProductId, createExport, 
                loadExports, loadExportDetails, loadProductPrices, 
                getInventoryReport, getExpiryDateReport}