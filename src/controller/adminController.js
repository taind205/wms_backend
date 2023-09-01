import userService from "../service/userService";
import warehouseService from "../service/warehouseService";
import storeService from "../service/storeService";
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
    const isCreateComplete = await userService.createAccount(req.body);
    isCreateComplete ?
    res.send({msg:"Tạo tài khoản thành công"}) : 
    res.send({msg:"Tạo tài khoản thất bại"})
}

const updateAccount = async (req, res) => {
    const isComplete = await userService.updateAccount(req.body);
    isComplete ?
    res.status(200).send({msg:"Cập nhật thành công", err:0}) : 
    res.status(200).send({msg:"Cập nhật thất bại", err:1})
}

const addStore = async (req, res) => {
    // req.file is the name of your file in the form above, here 'uploaded_file'
    // req.body will hold the text fields, if there were any 
    // req.file.filename=req.body.name;
    console.log(req.file, req.body)
    let img_path='';
    if(!req.file) {
        if(req.body.useDefaultImage) img_path='C:\\IT\\DB\\WMS\\Image\\Store\\default.png';
        else {res.send({msg:"File không hợp lệ.", err:21}); return;} }
    else img_path=req.file.path;
    
    if(req.body.name.trim()=='')
        {res.send({msg:"Tên cửa hàng không được trống.", err:22}); return;}
    if(!req.body.modifiedBy)
        {res.send({msg:"Người cập nhật không thích hợp.", err:23}); return;}
    else {
        const isComplete = await storeService.addStore(req.body, img_path);
        isComplete? res.send({msg:"Thêm cửa hàng thành công", err:0})
        : res.send({msg:"Thêm cửa hàng thất bại", err:2})
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
        const isComplete = await storeService.updateStore(req.body, req.file?.path);
        isComplete? res.send({msg:"Cập nhật cửa hàng thành công", err:0})
        : res.send({msg:"Cập nhật cửa hàng thất bại", err:3})
    }
}

const loadStores = async (req, res) => {
    const list = await storeService.loadStores(req.query);
    res.send(list);
}

const loadStoreImage = async (req, res) => {
const path = await storeService.getStoreImagePath(req.params.id);
res.sendFile(path?path:'C:\\IT\\Project\\WMS\\DB\\Img\\404-error.png');
}

const addWarehouse = async (req, res) => {
    // req.file is the name of your file in the form above, here 'uploaded_file'
    // req.body will hold the text fields, if there were any 
    // req.file.filename=req.body.name;

    console.log(req.file, req.body)
    let img_path='';
    if(!req.file) {
        if(req.body.useDefaultImage) img_path='C:\\IT\\DB\\WMS\\Image\\Warehouse\\default.png';
        else {res.send({msg:"File không hợp lệ.", err:21}); return;} }
    else img_path=req.file.path;
    
    if(req.body.name.trim()=='')
        {res.send({msg:"Tên kho không được trống.", err:22}); return;}
    if(!req.body.modifiedBy)
        {res.send({msg:"Người cập nhật không thích hợp.", err:23}); return;}

    else {
        const isComplete = await warehouseService.addWarehouse(req.body, img_path);
        isComplete? res.send({msg:"Thêm kho thành công", err:0})
        : res.send({msg:"Thêm kho thất bại", err:2})
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
        const isComplete = await warehouseService.updateWarehouse(req.body, req.file?.path);
        isComplete? res.send({msg:"Cập nhật kho thành công", err:0})
        : res.send({msg:"Cập nhật kho thất bại", err:3})
    }
}

const loadListWarehouse = async (req, res) => {
    const list = await warehouseService.loadListWarehouse(req.query);
    res.send(list);
}

const loadWarehouseImage = async (req, res) => {
const path = await warehouseService.getWarehouseImagePath(req.params.id);
res.sendFile(path?path:'C:\\IT\\Project\\WMS\\DB\\Img\\404-error.png');
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
        {res.send({msg:"Họ và tên không được trống.", err:22}); return;}

    {
        const isComplete = await userService.updateUserInfo(req.body);
        isComplete? res.send({msg:"Cập nhật thành công", err:0})
        : res.send({msg:"Cập nhật thất bại", err:3})
    }
}

module.exports = {getAllUser, loadListAccount, createAccount, updateAccount, addWarehouse, 
                    loadWarehouseImage, loadListWarehouse, updateWarehouse, 
                    loadWarehouseKeepers, loadAvailableWarehouseKeepers, 
                    addStore, loadStoreImage, loadStores, updateStore, 
                    handleLogin, getUserInfo, updateUserInfo}