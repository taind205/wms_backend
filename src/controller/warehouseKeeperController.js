import productService from "../service/productService";
import warehouseService from "../service/warehouseService"
import { FILE_STORAGE_PATH, SL } from "../routes/route";
import { ERRORS, MSG } from "../msg";

const addStorageLocation = async (req, res) => {
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
        {res.send(ERRORS[21]); return;}
    if(!req.body.modifiedBy)
        {res.send(ERRORS[10]); return;}
    else {
        const isComplete = await warehouseService.addStorageLocation(req.body, img_filename);
        isComplete? res.send({msg:MSG[8], err:0})
        : res.send(ERRORS[22])
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
        const isComplete = await warehouseService.updateStorageLocation(req.body, req.file?.filename);
        isComplete? res.send({msg:MSG[9], err:0})
        : res.send(ERRORS[23])
    }
}

const loadStorageLocations = async (req, res) => {
    const list = await warehouseService.loadStorageLocations(req.query);
    res.send(list);
}

const loadStorageLocationImage = async (req, res) => {
const path = await warehouseService.getStorageLocationImagePath(req.params.id);
res.sendFile(path? FILE_STORAGE_PATH+'img'+SL+'storage_location'+SL+path : FILE_STORAGE_PATH+'img'+SL+'404-error.png');
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