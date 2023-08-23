import productService from "../service/productService"

const addProduct = async (req, res) => {
    // req.file is the name of your file in the form above, here 'uploaded_file'
    // req.body will hold the text fields, if there were any 
    // req.file.filename=req.body.name;
    console.log(req.file, req.body)
    let img_path='';
    if(!req.file) {
        if(req.body.useDefaultImage) img_path='C:\\IT\\DB\\WMS\\Image\\Product\\default.png';
        else {res.send({msg:"File không hợp lệ.", err:21}); return;} }
    else img_path=req.file.path;
    
    if(req.body.name.trim()=='')
        {res.send({msg:"Tên hàng hóa không được trống.", err:22}); return;}
    if(req.body.StatusId==0)
        {res.send({msg:"Trạng thái hàng hóa không được trống.", err:23}); return;}

    else {
        const isComplete = await productService.addProduct(req.body, img_path);
        isComplete? res.send({msg:"Thêm hàng hóa thành công", err:0})
        : res.send({msg:"Thêm hàng hóa thất bại", err:2})
    }
}

const updateProduct = async (req, res) => {
    // req.file is the name of your file in the form above, here 'uploaded_file'
    // req.body will hold the text fields, if there were any 
    // req.file.filename=req.body.name;
    console.log(req.file, req.body)
    // if(!req.file)
    //     res.send({msg:"File không hợp lệ", err:21})
    // else 


    if(!req.body.name || req.body.name.trim()=='')
        {res.send({msg:"Tên hàng hóa không được trống.", err:22}); return;}
    if(!req.body.StatusId)
        {res.send({msg:"Trạng thái hóa không được trống.", err:23}); return;}
    Object.keys(req.body).forEach(key => { if (!req.body[key]) { delete req.body[key]; } });
    {
        const isComplete = await productService.updateProduct(req.body, req.file?.path);
        isComplete? res.send({msg:"Cập nhật hàng hóa thành công", err:0})
        : res.send({msg:"Cập nhật hàng hóa thất bại", err:3})
    }
}

const loadListProduct = async (req, res) => {
    const list = await productService.loadListProduct(req.query);
    res.send(list);
}

const loadProductImage = async (req, res) => {
    const path = await productService.getProductImagePath(req.params.id);
    res.sendFile(path||'C:\\IT\\DB\\WMS\\Image\\404-error.png');
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
        {res.send({msg:"Cần chọn một kho.", err:22}); return;}
    if(!req.body.list || !req.body.list.length)
        {res.send({msg:"Cần ít nhất một hàng hóa trong phiếu nhập.", err:23}); return;}
    const isComplete = await productService.createImport(req.body);
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
        {res.send({msg:"Cần chọn một cửa hàng.", err:22}); return;}
    if(!req.body.list || !req.body.list.length)
        {res.send({msg:"Cần ít nhất một hàng hóa trong phiếu xuất.", err:23}); return;}

    const isComplete = await productService.createExport(req.body);
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