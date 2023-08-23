import productService from "../service/productService";
import warehouseService from "../service/warehouseService"

const addStorageLocation = async (req, res) => {
    // req.file is the name of your file in the form above, here 'uploaded_file'
    // req.body will hold the text fields, if there were any 
    // req.file.filename=req.body.name;
    console.log(req.file, req.body)
    let img_path='';
    if(!req.file) {
        if(req.body.useDefaultImage) img_path='C:\\IT\\DB\\WMS\\Image\\StorageLocation\\default.png';
        else {res.send({msg:"File không hợp lệ.", err:21}); return;} }
    else img_path=req.file.path;
    
    if(req.body.name.trim()=='')
        {res.send({msg:"Tên vị trí lưu trữ không được trống.", err:22}); return;}
    if(!req.body.modifiedBy)
        {res.send({msg:"Người cập nhật không thích hợp.", err:23}); return;}
    else {
        const isComplete = await warehouseService.addStorageLocation(req.body, img_path);
        isComplete? res.send({msg:"Thêm vị trí lưu trữ thành công", err:0})
        : res.send({msg:"Thêm vị trí lưu trữ thất bại", err:2})
    }
}

const updateStorageLocation = async (req, res) => {
    // req.file is the name of your file in the form above, here 'uploaded_file'
    // req.body will hold the text fields, if there were any 
    // req.file.filename=req.body.name;
    console.log(req.file, req.body)
    // if(!req.file)
    //     res.send({msg:"File không hợp lệ", err:21})
    // else 
    {
        const isComplete = await warehouseService.updateStorageLocation(req.body, req.file?.path);
        isComplete? res.send({msg:"Cập nhật vị trí lưu trữ thành công", err:0})
        : res.send({msg:"Cập nhật vị trí lưu trữ thất bại", err:3})
    }
}

const loadStorageLocations = async (req, res) => {
    const list = await warehouseService.loadStorageLocations(req.query);
    res.send(list);
}

const loadStorageLocationImage = async (req, res) => {
const path = await warehouseService.getStorageLocationImagePath(req.params.id);
res.sendFile(path?path:'C:\\IT\\Project\\WMS\\DB\\Img\\404-error.png');
}

const loadImports = async (req, res) => {
    const list = await productService.loadImports(req.query);
    res.send(list);
}

const loadImportDetails = async (req, res) => {
    const list = await productService.loadImportDetails(req.query);
    res.send(list);
}

const updateImport = async (req, res) => {
    const isComplete = await warehouseService.updateImport(req.body);
    isComplete? res.send({msg:"Cập nhật thành công", err:0})
    : res.send({msg:"Cập nhật thất bại", err:2})
}

const loadExports = async (req, res) => {
    const list = await productService.loadExports(req.query);
    res.send(list);
}

const loadExportDetails = async (req, res) => {
    const list = await productService.loadExportDetails(req.query);
    res.send(list);
}

const updateExport = async (req, res) => {
    const isComplete = await warehouseService.updateExport(req.body);
    isComplete? res.send({msg:"Cập nhật thành công", err:0})
    : res.send({msg:"Cập nhật thất bại", err:2})
}

const loadStorageLocationsbyProductId = async (req, res) => {
    if(!req.query.id)
        res.send({msg:'Cần chọn hàng hóa', err:31});
    else {
    const list = await warehouseService.loadStorageLocationsbyProductId(req.query);
    res.send(list);
    }
}

const loadStorageLocationProducts = async (req, res) => {
    const list = await warehouseService.loadStorageLocationProducts(req.query);
    res.send(list);
}

module.exports = {addStorageLocation, loadStorageLocationImage, loadStorageLocations, updateStorageLocation, 
                loadImports, loadImportDetails, updateImport,
                loadExports, loadExportDetails, updateExport, loadStorageLocationsbyProductId, 
                loadStorageLocationProducts,}

// const loadAvailableWarehouseKeepers = async (req, res) => {
//     const list = await warehouseService.loadAvailableWarehouseKeepers(req.query);
//     res.send(list);
// }

// const loadWarehouseKeepers = async (req, res) => {
//     const list = await warehouseService.loadWarehouseKeepers(req.query);
//     res.send(list);
// }