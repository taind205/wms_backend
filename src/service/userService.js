import db from "../db/models"
import { Op } from "sequelize";
import { ERRORS, MSG } from "../msg";

const getAllUser = async () => {
    const users = await db.User.findAll();
    return users
}

const handleLogin = async (info) => {
    // const load_num = n || 0;
    const accountID_filt = {id:info.id, password:info.password};

    // //Sequelize use Inner Join if use where: x_filt inside 'include' key
    const user = {model:db.User, attributes:["fullname",'id']};
    // const status_filt = status ? {model:db.Status, where:{id:status}, attributes:["name"]} : {model:db.Status, attributes:["name"]};
    // const role_filt = role ? {model:db.Role, where:{id:role}, attributes:["name"]} : {model:db.Role, attributes:["name"]}; 
    const loadsize=2;
    let acc=[];
    try{
        // if(accountID) {
            acc = await db.Account.findOne({attributes:["RoleId","StatusId"],
            where:accountID_filt,
            include: [ user]});
            if(!acc)
                return ERRORS[0];
            if (acc.StatusId==2)
                return ERRORS[1];
            
            if (acc.RoleId==2)
                {
                const wh = await db.WarehouseKeeper.findOne({attributes:["WarehouseId"]
                , where:{UserId:acc.User.dataValues.id, isActive:1}});
                if(wh)
                return {RoleId:acc.RoleId, fullName:acc.User.dataValues.fullname, UserId:acc.User.dataValues.id, WarehouseId:wh.WarehouseId, err:0, msg:MSG[0]}
                else return ERRORS[2];
            }
            else return {RoleId:acc.RoleId, fullName:acc.User.dataValues.fullname, UserId:acc.User.dataValues.id, err:0, msg:MSG[0]}
            
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
    console.log('return',acc);
    return acc;
}

const loadListAccount = async (n, accountID, fullName, status, role) => {
    const load_num = n || 0;
    const accountID_filt = accountID ? { id:{[Op.like]: '%' + accountID + '%'} } : {};

    //Sequelize use Inner Join if use where: x_filt inside 'include' key
    const fullName_filt = fullName ? {model:db.User, attributes:["fullname"], where:{ fullname:{[Op.like]: '%' + fullName + '%'} }}
                                     : {model:db.User, attributes:["fullname"]};
    const status_filt = status ? {model:db.Status, where:{id:status}, attributes:["name"]} : {model:db.Status, attributes:["name"]};
    const role_filt = role ? {model:db.Role, where:{id:role}, attributes:["name"]} : {model:db.Role, attributes:["name"]}; 
    const loadsize=2;
    let acc=[];
    try{
        // if(accountID) {
            acc = await db.Account.findAll({order: [['createdAt', 'DESC']], attributes:["id","createdAt",],
            where:accountID_filt,
            include: [ fullName_filt,
                        role_filt,
                        status_filt],
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
    return acc;
}

const createAccount = async (account_info) => {
    if(!account_info.id)
        return ERRORS[3].msg;

    let new_user = {}
    try{
        new_user = await db.Account.findOne({where:{id:account_info.id}, attributes:["id"]});
        if(new_user)
            return ERRORS[4].msg;
        
        new_user = await db.User.findOne({where:{ [Op.or]: [{email:{[Op.like]: account_info.email}},
            {citizenID:{[Op.like]: account_info.citizenID}}, {phoneNumber:{[Op.like]: account_info.phoneNumber}} 
        ]}, attributes:["email","citizenID","phoneNumber"]});
        if(new_user)
        {
            if (account_info.email && new_user.email==account_info.email)
                {return ERRORS[5]}
            // if (new_user.citizenID==account_info.citizenID)
            //     {return "Số CCCD đã được sử dụng."}
            // if (new_user.phoneNumber==account_info.phoneNumber)
            //     {return "Số điện thoại đã được sử dụng."}
            
                //return "Email, CCCD hoặc SĐT bị trùng lặp.";
        }
        
        new_user = await db.User.create({ fullName: account_info.fullName, gender:account_info.gender, email:account_info.email });
    }
    catch(e)
    {
        console.error(e);
        return MSG[2]+ e;
    }

    if(!new_user.id)
        {
            console.error("New created User not has proper id");
            return  MSG[2] + "New created User not has proper id";
        }
    
    try{
    const new_account = await db.Account.create({id:account_info.id, RoleId:account_info.role, UserId:new_user.id,
            StatusId:1, password:account_info.password});
    }
    catch(e)
    {
        console.error(e);
        return MSG[2]+ e;
    }

    return 0;
}

const updateAccount = async (update_info) => {
    let update = {}
    update_info.role ? update.RoleId = update_info.role : {}
    update_info.status ? update.StatusId = update_info.status : {}

    try {
        await db.Account.update(update, { where: { id: update_info.id } }); 
    } catch(e) {
        console.error(e);
        return false;
    }
    return true;
}

const getUserInfo = async (query) => {
    let info=null;
    // const Export_fill = {model:db.Export, attributes:['id'], where:{id:query.id}};
    try{
        console.log(query);
        info = await db.User.findOne({
                    where:{id: query.id},
                    // through:{attributes: ['productNumber'],  where:{ExportId: Number(query.id)},},
                    // {model:db.Product, attributes:['name']}, 
                    // include: [
                    //     {model:db.ExportProduct, attributes: ['productNumber'], where:{ExportId: query.id}},
                    //      {model:db.Product, attributes:['name']}
                    // ],
                    }); }
    catch(e) {
        console.error(e);
        return {message:MSG[1]}; }
    return info;
}

const updateUserInfo = async (update_info) => {
    console.log("update user info:", update_info);
    try{
        const updated_record = await db.User.update(update_info, { where: { id:update_info.id }});
        console.log('finish update userinfo', updated_record);
    }
    catch(e)
    {
        console.error(e);
        return false;
    }

    return true;
}

module.exports = { getAllUser, loadListAccount, createAccount, updateAccount, handleLogin, 
                    getUserInfo, updateUserInfo}