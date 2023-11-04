import userService from "../service/userService";
import warehouseService from "../service/warehouseService";
import storeService from "../service/storeService";
import { ERRORS, MSG } from "../msg";
import { FILE_STORAGE_PATH } from "../routes/route";
var jwt = require('jsonwebtoken');
const secret_key='123'

const getAllUser = async (req, res) => {
    let users = await userService.getAllUser();
    console.log(users);
    res.send(users);
}

const handleLogin = async (req, res) => {
    let info = await userService.handleLogin(req.body);
    console.log(info);
    let token = null;
    if(info.err==0)
        {
            if(info.RoleId==2)
            token = jwt.sign({ r:info.RoleId, u:info.UserId, w:info.WarehouseId }, secret_key);
            else
            token = jwt.sign({ r:info.RoleId, u:info.UserId }, secret_key);
            console.log('jwt created',token);
        }
    res.cookie('jwt', token, { expires: new Date(Date.now() + 1 * 3600000), httpOnly: true,  // cookie will be removed after 1 hours
     });
    res.cookie('Role', info.RoleId);
    res.send(Object.assign(info,{jwt:token}));
}

const loadListAccount = async (req, res) => {

    const acc = await userService.loadListAccount(req.params.n,req.query.accountID,req.query.fullName,req.query.status,req.query.role);
    res.send(acc);
}

const createAccount = async (req, res) => {
    if(!req.body.id)
    {
        res.send({msg:ERRORS[6].msg});
        return;
    }
    if(!req.body.fullName)
    {
        res.send({msg:ERRORS[7].msg});
        return;
    }
    const err = await userService.createAccount(req.body);
    err ?
    res.send({msg:err}) : 
    res.send({msg:MSG[3]})
}

const updateAccount = async (req, res) => {
    const isComplete = await userService.updateAccount(req.body);
    isComplete ?
    res.status(200).send({msg:MSG[4], err:0}) : 
    res.status(200).send({msg:MSG[5], err:1})
}

const addStore = async (req, res) => {
    // req.file is the name of your file in the form above, here 'uploaded_file'
    // req.body will hold the text fields, if there were any 
    // req.file.filename=req.body.name;
    console.log(req.file, req.body)
    let img_filename='';
    if(!req.file) {
        if(req.body.useDefaultImage) img_filename='default.png';
        else {res.send(ERRORS[8]); return;} }
    else img_filename=req.file.filename;
    
    if(req.body.name.trim()=='')
        {res.send(ERRORS[9]); return;}
    if(!req.body.modifiedBy)
        {res.send(ERRORS[10]); return;}
    else {
        const isComplete = await storeService.addStore(req.body, img_filename);
        isComplete? res.send({msg:MSG[6], err:0})
        : res.send(ERRORS[11])
    }
}

const updateStore = async (req, res) => {
    // req.file is the name of your file in the form above, here 'uploaded_file'
    // req.body will hold the text fields, if there were any 
    // req.file.filename=req.body.name;
    console.log(req.file, req.body)
    // if(!req.file)
    //     res.send({msg:"File không hợp lệ", err:21})
    // else 
    {
        const isComplete = await storeService.updateStore(req.body, req.file?.filename);
        isComplete? res.send({msg:MSG[4], err:0})
        : res.send(ERRORS[12])
    }
}

const loadStores = async (req, res) => {
    const list = await storeService.loadStores(req.query);
    res.send(list);
}

const loadStoreImage = async (req, res) => {
const filename = await storeService.getStoreImagePath(req.params.id);
res.sendFile(filename? FILE_STORAGE_PATH+'\\img\\store\\'+filename : FILE_STORAGE_PATH+'\\img\\404-error.png');
}

const addWarehouse = async (req, res) => {
    // req.file is the name of your file in the form above, here 'uploaded_file'
    // req.body will hold the text fields, if there were any 
    // req.file.filename=req.body.name;

    console.log(req.file, req.body)
    let img_filename='';
    if(!req.file) {
        if(req.body.useDefaultImage) img_filename='default.png';
        else {res.send(ERRORS[8]); return;} }
    else img_filename=req.file.filename;
    
    if(req.body.name.trim()=='')
        {res.send(ERRORS[13]); return;}
    if(!req.body.modifiedBy)
        {res.send(ERRORS[10]); return;}

    else {
        const isComplete = await warehouseService.addWarehouse(req.body, img_filename);
        isComplete? res.send({msg:MSG[7], err:0})
        : res.send(ERRORS[14])
    }
}

const updateWarehouse = async (req, res) => {
    // req.file is the name of your file in the form above, here 'uploaded_file'
    // req.body will hold the text fields, if there were any 
    // req.file.filename=req.body.name;
    console.log(req.file, req.body)
    // if(!req.file)
    //     res.send({msg:"File không hợp lệ", err:21})
    // else 
    {
        const isComplete = await warehouseService.updateWarehouse(req.body, req.file?.filename);
        isComplete? res.send({msg:MSG[4], err:0})
        : res.send(ERRORS[15])
    }
}

const loadListWarehouse = async (req, res) => {
    const list = await warehouseService.loadListWarehouse(req.query);
    res.send(list);
}

const loadWarehouseImage = async (req, res) => {
    const filename = await warehouseService.getWarehouseImagePath(req.params.id);
    res.sendFile(filename? FILE_STORAGE_PATH+'\\img\\warehouse\\'+filename : FILE_STORAGE_PATH+'\\img\\404-error.png');
}

const loadAvailableWarehouseKeepers = async (req, res) => {
    const list = await warehouseService.loadAvailableWarehouseKeepers(req.query);
    res.send(list);
}

const loadWarehouseKeepers = async (req, res) => {
    const list = await warehouseService.loadWarehouseKeepers(req.query);
    res.send(list);
}

const getUserInfo = async (req, res) => {
    // if(req.body.gender==undefined)
    //     {res.send({msg:"Giới tính không được trống.", err:23}); return;}

    const info = await userService.getUserInfo(req.query);
    res.send(info);
}

const updateUserInfo = async (req, res) => {
    
    if(req.body.fullName.trim()=='')
        {res.send(ERRORS[16]); return;}

    {
        const isComplete = await userService.updateUserInfo(req.body);
        isComplete? res.send({msg:MSG[4], err:0})
        : res.send({msg:MSG[5], err:3})
    }
}

module.exports = {getAllUser, loadListAccount, createAccount, updateAccount, addWarehouse, 
                    loadWarehouseImage, loadListWarehouse, updateWarehouse, 
                    loadWarehouseKeepers, loadAvailableWarehouseKeepers, 
                    addStore, loadStoreImage, loadStores, updateStore, 
                    handleLogin, getUserInfo, updateUserInfo}