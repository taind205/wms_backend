import db from "../db/models"
import { Op } from "sequelize";


// const getAllUser = async () => {
//     const users = await db.User.findAll();
//     return users
// }

const loadListWarehouse = async (query) => {
    const load_num = query.n || 0;
    let filter = {};
    query.name? filter.name={[Op.like]: '%' + query.name + '%'} : {};
    query.description? filter.description={[Op.like]: '%' + query.description + '%'} : {};
    query.address? filter.address={[Op.like]: '%' + query.address + '%'} : {};
    query.id? filter.id = query.id:{};

    //Sequelize use Inner Join if use where: x_filt inside 'include' key
    const modifiedBy_filt = query.modifiedBy ? {model:db.User, attributes:["fullname"], where:{ fullname:{[Op.like]: '%' + query.modifiedBy + '%'} }}
                             : {model:db.User, attributes:["fullname"]};
    const loadsize=2;
    let list=[];
    try{
        // if(accountID) {
        list = await db.Warehouse.findAll({order: [['updatedAt', 'DESC']], attributes:["id","name",'address','description','updatedAt'],
                    where:filter,
                    include: [ modifiedBy_filt],
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
        return {message:MSG[1]};
    }
    return list;
}

const addWarehouse = async (info,img_path) => {
    info.image = img_path
    info.id = null;
    console.log("add warehouse:", info);
    
    
    //db.Warehouse.removeAttribute('id');

    try{
        const new_record = await db.Warehouse.create(info);
        for(const keeper of info.keepers.split(',')){
            if(keeper){
            console.log('add', keeper);
            await db.WarehouseKeeper.update({isActive:0},{where:{UserId:keeper, isActive:1},limit:1});
            const new_record2 = await db.WarehouseKeeper.create({WarehouseId:new_record.id, UserId:keeper, isActive:1});}
        }
        console.log('finish add warehouse',new_record);
    }
    catch(e)
    {
        console.error(e);
        return false;
    }

    return true;
}

const updateWarehouse = async (update_info,img_path) => {
    img_path? update_info.image = img_path : {};
    console.log("update warehouse:", update_info);

    try{
        // const warehouse = await db.Warehouse.findOne({ where: { id:update_info.id }, attributes:["id","image"]});
        // delete file from image path
        const updated_record = await db.Warehouse.update(update_info, { where: { id:update_info.id }});
        for(const keeper of update_info.deprecated_keepers.split(',')){
            if(keeper){
            console.log('delete', keeper);
            await db.WarehouseKeeper.update({isActive:0},{where:{WarehouseId:update_info.id, UserId:keeper, isActive:1},limit:1});}
        }
        for(const keeper of update_info.new_keepers.split(',')){
            if(keeper){
            console.log('add', keeper);
            await db.WarehouseKeeper.update({isActive:0},{where:{UserId:keeper, isActive:1},limit:1});
            await db.WarehouseKeeper.create({WarehouseId:update_info.id, UserId:keeper,isActive:1});}
        }
        console.log('finish update warehouse', updated_record);
    }
    catch(e)
    {
        console.error(e);
        return false;
    }

    return true;
}

const getWarehouseImagePath = async (id) => {
    
    console.log("getWarehouseImagePath:", id);
    
    try{
        const w = await db.Warehouse.findOne({attributes:["image"],
            where:{ id: id } });
        console.log('path',w)
        if(w!=undefined) 
        return w.image;
        else return'';
    }
    catch(e)
    {
        console.error(e);
        return '';
    }
}

const loadAvailableWarehouseKeepers = async (query) => {
    const load_num = query.n || 0;
    let filter = {};
    query.name? filter.id={[Op.like]: '%' + query.name + '%'} : {};
    // const fullName_filt = query.name ? {model:db.User, attributes:["fullname"], where:{ fullname:{[Op.like]: '%' + fullName + '%'} }}
    filter.RoleID=2;
    const loadsize=5;
    let result=[];
    try{
        const list = await db.User.findAll({ attributes:['id',"fullName"],
                    // where:filter,
                    include: [ {model:db.Account, attributes:['id'], where:filter}],
                    limit:loadsize, raw: true}); 
        console.log(list);
        for(const user of list) {
            console.log('user in list',user);
            const wh = await db.WarehouseKeeper.findOne({attributes:[],where:{UserId:user.id, isActive:1},
                                include:[{model:db.Warehouse, attributes:['name']}], raw:true});
            console.log('wh getted',wh);
            if(wh)
            result.push({id:user.id, Account:{id:user['Account.id']},fullName:user.fullName,WarehouseName:wh['Warehouse.name']});
            else
            result.push({id:user.id, Account:{id:user['Account.id']},fullName:user.fullName});
        }
                }
    catch(e) {
        console.error(e);
        return {message:MSG[1]}; }
    return result;
}

const loadWarehouseKeepers = async (query) => {
    let list=[];
    try{
        list = await db.User.findAll({order: [['updatedAt', 'ASC']], attributes:['id',"fullName"],
                    //where:{ProductId:query.id},
                    include: [ {model:db.WarehouseKeeper, attributes:[],where:{ WarehouseId:query.id, isActive:1 }},
                                {model:db.Account, attributes:['id']}],
                    }); }
    catch(e) {
        console.error(e);
        return {message:MSG[1]}; }
    return list;
}

const loadStorageLocations = async (query) => {
    const load_num = query.n || 0;
    let filter = {};
    query.name? filter.name={[Op.like]: '%' + query.name + '%'} : {};
    query.description? filter.description={[Op.like]: '%' + query.description + '%'} : {};
    query.WarehouseId? filter.WarehouseId=query.WarehouseId : '';
    query.Status? filter.StatusId=query.StatusId : '';

    //Sequelize use Inner Join if use where: x_filt inside 'include' key
    const modifiedBy_filt = query.modifiedBy ? {model:db.User, attributes:["fullname"], where:{ fullname:{[Op.like]: '%' + query.modifiedBy + '%'} }}
                        : {model:db.User, attributes:["fullname"]};
    // const WarehouseId_filt = query.WarehouseId ? {model:db.Warehouse, attributes:[], where:{ id:query.WarehouseId }}
    //                     : {};
    // const status_filt = query.status ? {model:db.Status, where:{id:query.status}, attributes:[]} 
    //                     : {model:db.Status, attributes:["name"]};

    const loadsize=4;
    let list=[];
    try{
        list = await db.StorageLocation.findAll({order: [['updatedAt', 'DESC']], attributes:['id','name','description','updatedAt', 'StatusId'],
                    where:filter,
                    include: [ modifiedBy_filt],
                    limit:loadsize, offset:loadsize*load_num});
    }
    catch(e)
    {
        console.error(e);
        return {message:MSG[1]};
    }
    return list;
}

const addStorageLocation = async (info,img_path) => {
    info.image = img_path
    console.log("add StorageLocation:", info);

    try{
        const new_record = await db.StorageLocation.create(info);
        console.log('finish add StorageLocation',new_record);
    }
    catch(e)
    {
        console.error(e);
        return false;
    }

    return true;
}

const updateStorageLocation = async (update_info,img_path) => {
    img_path? update_info.image = img_path : {};
    console.log("update StorageLocation:", update_info);

    try{
        // const StorageLocation = await db.StorageLocation.findOne({ where: { id:update_info.id }, attributes:["id","image"]});
        // delete file from image path
        const updated_record = await db.StorageLocation.update(update_info, { where: { id:update_info.id }});
        console.log('finish update StorageLocation', updated_record);
    }
    catch(e)
    {
        console.error(e);
        return false;
    }
    return true;
}

const getStorageLocationImagePath = async (id) => {
    
    console.log("get StorageLocation ImagePath:", id);
    
    try{
        const w = await db.StorageLocation.findOne({attributes:["image"], where:{ id: id } });
        console.log('StorageLocation Img path',w)
        if(w!=undefined) 
        return w.image;
        else return'';
    }
    catch(e)
    {
        console.error(e);
        return '';
    }
}

const updateImport = async (update_info) => {
    //info.StatusId=1;
    
    console.log("update import:", update_info, update_info.list);

    try{
        if(update_info.StatusId==3)
            {
            const inventory = {};
                if(update_info.list)
                    for(const p_sl_detail of update_info.list){
                        // detail.ImportId = update_info.id;
                        console.log('add', p_sl_detail);
                        const new_record2 = await db.ProductStorageLocation.create(p_sl_detail);
                        inventory[p_sl_detail.ImportProductId]?
                        inventory[p_sl_detail.ImportProductId]=Number(p_sl_detail.inventoryNumber)+Number(inventory[p_sl_detail.ImportProductId]):
                        inventory[p_sl_detail.ImportProductId]=p_sl_detail.inventoryNumber
                    }
            console.log('inventory: ', inventory);
            for(const ip_id of Object.getOwnPropertyNames(inventory))
                await db.ImportProduct.update({inventory:inventory[ip_id]}, {where:{id:ip_id} });
            update_info.importDate=Date.now();
            }
        
        const new_record = await db.Import.update(update_info,{ where: { id:update_info.id }});
        console.log('finish update import',new_record);
    }
    catch(e)
    {
        console.error(e);
        return false;
    }
    return true;
}

const updateExport = async (update_info) => {
    //info.StatusId=1;
    
    console.log("update export:", update_info, update_info.list);

    try{
        if(update_info.StatusId==3)
            {
            const exportNumber = {};
                if(update_info.list)
                    for(const p_sl_detail of update_info.list){
                        console.log('update', p_sl_detail);
                        const new_record2 = await db.ProductStorageLocation.update(p_sl_detail, 
                                {where:{ImportProductId:p_sl_detail.ImportProductId, StorageLocationId:p_sl_detail.StorageLocationId}});
                        exportNumber[p_sl_detail.ImportProductId]?
                        exportNumber[p_sl_detail.ImportProductId]=Number(p_sl_detail.exportNumber)+Number(exportNumber[p_sl_detail.ImportProductId]):
                        exportNumber[p_sl_detail.ImportProductId]=p_sl_detail.exportNumber
                    }
            console.log('inventory: ', exportNumber);
            for(const ip_id of Object.getOwnPropertyNames(exportNumber))
                {
                    const pb = await db.ImportProduct.findOne({where:{id:ip_id} });
                    await db.ImportProduct.update({inventory:pb.inventory-exportNumber[ip_id]}, {where:{id:ip_id} });
                    console.log('update bp inventory:', {inventory:pb.inventory-exportNumber[ip_id]}, {where:{id:ip_id} });
                }
            update_info.exportDate=Date.now();
            }
        
        const new_record = await db.Export.update(update_info,{ where: { id:update_info.id }});
        console.log('finish update export',new_record);
    }
    catch(e)
    {
        console.error(e);
        return false;
    }
    return true;
}

const loadStorageLocationsbyProductId = async (query) => {
    const load_num = query.n || 0;

    const loadsize=4;
    let list=[];
    try{
        list = await db.StorageLocation.findAll(
                {include: [ {model:db.ProductStorageLocation, attributes:['inventoryNumber'],where:{ImportProductId:query.id}}],
                    order: [[db.ProductStorageLocation,'inventoryNumber', 'DESC']],
                     attributes:['id','name',],
                    // where:{} ,
                    limit:loadsize, offset:loadsize*load_num});
    }
    catch(e)
    {
        console.error(e);
        return {message:MSG[1]};
    }
    return list;
}

const loadStorageLocationProducts = async (query) => {
    const load_num = query.n || 0;

    //const loadsize=5;
    let list=[];
    try{
        list = await db.ProductStorageLocation.findAll({attributes:['inventoryNumber'],
                    order: [['createdAt', 'DESC']],
                    include: [ {model:db.ImportProduct, attributes:['id','expiryDate'],include:
                            [{model:db.Product, attributes:['id','name']}] }],
                    where:{StorageLocationId: query.id} ,
                    //limit:loadsize, offset:loadsize*load_num
                });
    }
    catch(e)
    {
        console.error(e);
        return {message:MSG[1]};
    }
    return list;
}

module.exports = { addWarehouse, getWarehouseImagePath, loadListWarehouse, updateWarehouse,
                 loadWarehouseKeepers, loadAvailableWarehouseKeepers, 
                 loadStorageLocations, addStorageLocation, updateStorageLocation, getStorageLocationImagePath,
                 updateImport, updateExport, loadStorageLocationsbyProductId, loadStorageLocationProducts}

// const updateAccount = async (update_info) => {
//     let update = {}
//     update_info.role ? update.RoleId = update_info.role : {}
//     update_info.status ? update.StatusId = update_info.status : {}

//     try {
//         await db.Account.update(update, { where: { id: update_info.id } }); 
//     } catch(e) {
//         console.error(e);
//         return false;
//     }
//     return true;
// }