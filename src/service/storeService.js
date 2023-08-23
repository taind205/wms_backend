import db from "../db/models"
import { Op } from "sequelize";

const loadStores = async (query) => {
    const load_num = query.n || 0;
    let filter = {};
    query.name? filter.name={[Op.like]: '%' + query.name + '%'} : {};
    query.description? filter.description={[Op.like]: '%' + query.description + '%'} : {};
    query.address? filter.address={[Op.like]: '%' + query.address + '%'} : {};

    //Sequelize use Inner Join if use where: x_filt inside 'include' key
    const modifiedBy_filt = query.modifiedBy ? {model:db.User, attributes:["fullname"], where:{ fullname:{[Op.like]: '%' + query.modifiedBy + '%'} }}
                             : {model:db.User, attributes:["fullname"]};
    const loadsize=2;
    let list=[];
    try{
        list = await db.Store.findAll({order: [['updatedAt', 'DESC']], attributes:["id","name",'address','description','updatedAt'],
                    where:filter,
                    include: [ modifiedBy_filt],
                    limit:loadsize, offset:loadsize*load_num});
    }
    catch(e)
    {
        console.error(e);
        return {message:"error occured"};
    }
    return list;
}

const addStore = async (info,img_path) => {
    info.image = img_path
    console.log("add store:", info);

    try{
        const new_record = await db.Store.create(info);
        // for(const keeper of info.keepers.split(',')){
        //     console.log('add', keeper);
        //     const new_record2 = await db.WarehouseKeeper.create({WarehouseId:new_record.id, UserId:keeper});
        // }
        console.log('finish add store',new_record);
    }
    catch(e)
    {
        console.error(e);
        return false;
    }

    return true;
}

const updateStore = async (update_info,img_path) => {
    img_path? update_info.image = img_path : {};
    console.log("update store:", update_info);

    try{
        // const warehouse = await db.Warehouse.findOne({ where: { id:update_info.id }, attributes:["id","image"]});
        // delete file from image path
        const updated_record = await db.Store.update(update_info, { where: { id:update_info.id }});
        // // for(const keeper of update_info.deprecated_keepers.split(',')){
        // //     console.log('delete', keeper);
        // //     await db.WarehouseKeeper.destroy({where:{WarehouseId:update_info.id, UserId:keeper}});
        // // }
        // for(const keeper of update_info.new_keepers.split(',')){
        //     console.log('add', keeper);
        //     await db.WarehouseKeeper.create({WarehouseId:update_info.id, UserId:keeper});
        // }
        console.log('finish update store', updated_record);
    }
    catch(e)
    {
        console.error(e);
        return false;
    }

    return true;
}

const getStoreImagePath = async (id) => {
    
    console.log("getStoreImagePath:", id);
    
    try{
        const w = await db.Store.findOne({attributes:["image"],
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

module.exports = { addStore, getStoreImagePath, loadStores, updateStore,}