import { ERRORS, MSG } from "../msg";
import productService from "../service/productService"
import { FILE_STORAGE_PATH } from "../routes/route";

const addProduct = async (req, res) => {
    // req.file is the name of your file in the form above, here 'uploaded_file'
    // req.body will hold the text fields, if there were any 
    // req.file.filename=req.body.name;
    const data = req.body;
    console.log(req.file, data)
    let img_filename='';
    if(!req.file) {
        if(data.useDefaultImage) img_filename='default.png';
        else {res.send(ERRORS[8]); return;} }
    else img_filename=req.file.filename;
    
    if(data.name.trim()=='')
        {res.send(ERRORS[24]); return;}
    if(data.StatusId==0)
        {res.send(ERRORS[25]); return;}
    if(!data.price || data.price <=0)
        {res.send(ERRORS[28]); return;}
    if(!data.shelfLife || data.shelfLife <=0)
        {res.send(ERRORS[29]); return;}

    else {
        const err = await productService.addProduct(data, img_filename);
        err? res.send(err)
        :  res.send({msg:MSG[10], err:0});
    }
}

const updateProduct = async (req, res) => {
    // req.file is the name of your file in the form above, here 'uploaded_file'
    // req.body will hold the text fields, if there were any 
    // req.file.filename=req.body.name;
    const data = req.body;
    console.log(req.file, data)
    // if(!req.file)
    //     res.send({msg:"File không hợp lệ", err:21})
    // else 


    if(!data.name || data.name.trim()=='')
        {res.send(ERRORS[24]); return;}
    if(!data.StatusId)
        {res.send(ERRORS[25]); return;}
    if(data.price && data.price <=0)
        {res.send(ERRORS[28]); return;}
    if(data.shelfLife && data.shelfLife <=0)
        {res.send(ERRORS[29]); return;}

    Object.keys(data).forEach(key => { if (!data[key]) { delete data[key]; } });
    {
        const err = await productService.updateProduct(data, req.file?.filename);
        err? res.send(err)
        : res.send({msg:MSG[11], err:0})
    }
}

const loadListProduct = async (req, res) => {
    const list = await productService.loadListProduct(req.query);
    res.send(list);
}

const loadProductImage = async (req, res) => {
    const filename = await productService.getProductImageFileName(req.params.id);
    res.sendFile(filename? FILE_STORAGE_PATH+'\\img\\product\\'+filename : FILE_STORAGE_PATH+'\\img\\404-error.png');
    }

const addTag = async (req, res) => {
    // req.file is the name of your file in the form above, here 'uploaded_file'
    // req.body will hold the text fields, if there were any 
    // req.file.filename=req.body.name;
    if(req.body.name.trim()=='')
        {res.send({msg:"Tên nhãn hàng hóa không được trống.", err:22}); return;}
    if(req.body.CategoryId==0)
        {res.send({msg:"Loại nhãn hàng hóa không được trống.", err:23}); return;}

    const isComplete = await productService.addTag(req.body);
    isComplete? res.send({msg:"Thêm nhãn hàng hóa thành công", err:0})
    : res.send({msg:"Thêm nhãn hàng hóa thất bại", err:2})
}

const updateTag = async (req, res) => {
    // req.file is the name of your file in the form above, here 'uploaded_file'
    // req.body will hold the text fields, if there were any 
    // req.file.filename=req.body.name;
    //console.log(req.file, req.body)
    // if(!req.file)
    //     res.send({msg:"File không hợp lệ", err:21})
    // else 
    if(!req.body.name || req.body.name.trim()=='')
        {res.send({msg:"Tên nhãn hàng hóa không được trống.", err:22}); return;}
    if(!req.body.CategoryId)
        {res.send({msg:"Loại nhãn hàng hóa không được trống.", err:23}); return;}

    {
        const isComplete = await productService.updateTag(req.body);
        isComplete? res.send({msg:"Cập nhật thành công", err:0})
        : res.send({msg:"Cập nhật thất bại", err:3})
    }
}

const loadTags = async (req, res) => {
    const list = await productService.loadTags(req.query);
    res.send(list);
}

const loadProductTags = async (req, res) => {
    const list = await productService.loadProductTags(req.query);
    res.send(list);
}

const loadCategory = async (req, res) => {
    const list = await productService.loadCategory();
    res.send(list);
}

const createImport = async (req, res) => {
    if(!req.body.WarehouseId)
        {res.send(ERRORS[17]); return;}
    if(!req.body.list || !req.body.list.length)
        {res.send(ERRORS[18]); return;}
    const isComplete = await productService.createImport(req.body, res.locals.user);
    isComplete? res.send({msg:"Tạo phiếu nhập thành công", err:0})
    : res.send({msg:"Tạo phiếu nhập thất bại", err:2})
}

const loadImports = async (req, res) => {
    const list = await productService.loadImports(req.query);
    res.send(list);
}

const loadProductBatchesbyProductId = async (req, res) => {
    if(!req.query.id)
        res.send({msg:'Cần chọn hàng hóa', err:31});
    else {
    const list = await productService.loadProductBatchesbyProductId(req.query);
    res.send(list);}
}

const createExport = async (req, res) => {
    // if(!req.body.WarehouseId)
    //     {res.send({msg:"Cần chọn một kho.", err:22}); return;}
    if(!req.body.StoreId)
        {res.send(ERRORS[19]); return;}
    if(!req.body.list || !req.body.list[0] || !req.body.list[0][0])
        {res.send(ERRORS[20]); return;}

    const isComplete = await productService.createExport(req.body, res.locals.user);
    isComplete? res.send({msg:"Tạo phiếu xuất thành công", err:0})
    : res.send({msg:"Tạo phiếu xuất thất bại", err:2})
}

const getInventoryReport = async (req, res) => {
    const list = await productService.getInventoryReport(req.query);
    res.send(list);
}

const getExpiryDateReport = async (req, res) => {
    const list = await productService.getExpiryDateReport(req.query);
    res.send(list);
}

const loadProductPrices = async (req, res) => {
    const list = await productService.loadProductPrices(req.query);
    res.send(list);
}

module.exports = {addProduct, loadListProduct, loadProductImage, updateProduct, 
                    loadCategory, loadTags, addTag, updateTag, loadProductTags,
                    createImport, loadImports,
                    loadProductBatchesbyProductId, createExport, 
                    getExpiryDateReport, getInventoryReport, loadProductPrices}