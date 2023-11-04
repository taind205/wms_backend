import express from "express";
import adminController from "../controller/adminController"
import businessController from "../controller/businessController"
import warehouseKeeperController from "../controller/warehouseKeeperController"
import multer from "multer";
import { admin_Auth, warehouseKeeper_Auth, business_Auth, get_Role } from "../middleware/auth";
//const upload = multer({ dest: 'C:\\IT\\Project\\WMS\\DB\\Img\\Warehouse\\' })

export const FILE_STORAGE_PATH = __filename.replace("src\\routes\\route.js","file_storage");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      //cb(null, 'C:\\IT\\Project\\WMS\\DB\\Img\\Warehouse\\')
      if (req.path.search('product')>-1)
        cb(null, FILE_STORAGE_PATH + '\\img\\product\\')
      else if (req.path.search('storage_location')>-1)
        cb(null, FILE_STORAGE_PATH + '\\img\\storage_location\\')
      else if(req.path.search('warehouse')>-1)
        cb(null, FILE_STORAGE_PATH + '\\img\\warehouse\\')
      else if (req.path.search('store')>-1)
        cb(null, FILE_STORAGE_PATH + '\\img\\store\\')
      else cb(null, FILE_STORAGE_PATH + '\\img\\')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix)

      //cb(null, req.body.name)
    }
  })

  function fileFilter (req, file, cb) {

    // The function should call `cb` with a boolean
    // to indicate if the file should be accepted
  
    if(file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') // | 'image/svg+xml' | 'image/webp') //'image/avif'  'image/vnd.microsoft.icon' 'image/tiff' 'image/bmp'
    // To accept the file pass `true`, like so:
    cb(null, true)
    else
    // To reject this file pass `false`, like so:
    cb(null, false)
  
    // You can always pass an error if something goes wrong:
    //cb(new Error('I don\'t have a clue!'))
  
  }
  
const upload = multer({ storage: storage, limits:{fileSize:1000000}, fileFilter:fileFilter }) //max 1 mb

const router = express.Router();

/**
 * @param {*} app:express app
 */

const initWebRoutes = (app) => {

    router.get("/", (req,res)=>{ return res.status(200).send("Hello world"); })
    router.get("/test", (req,res)=>{ console.log(FILE_STORAGE_PATH); return res.status(200).send(FILE_STORAGE_PATH); })

    router.get("/userinfo/get", adminController.getUserInfo);
    router.post("/userinfo/update", adminController.updateUserInfo);
    router.post("/login/", adminController.handleLogin);
    router.get("/role/get", get_Role);

    router.get("/admin/account/load/:n", admin_Auth, adminController.loadListAccount);
    router.post("/admin/account/create", admin_Auth, adminController.createAccount);
    router.post("/admin/account/update", admin_Auth, adminController.updateAccount);
    
    router.post('/admin/store/add', admin_Auth, upload.single('image'), adminController.addStore);
    router.post('/admin/store/update', admin_Auth, upload.single('image'), adminController.updateStore);
    router.get('/admin/store/img/:id', adminController.loadStoreImage);
    router.get('/admin/store/load', admin_Auth, adminController.loadStores);

    router.post('/admin/warehouse/add', admin_Auth, upload.single('image'), adminController.addWarehouse);
    router.post('/admin/warehouse/update', admin_Auth, upload.single('image'), adminController.updateWarehouse);
    router.get('/admin/warehouse/img/:id', adminController.loadWarehouseImage);
    router.get('/admin/warehouse/load', admin_Auth, adminController.loadListWarehouse);
    router.get('/admin/warehouse_keeper/load_available', admin_Auth, adminController.loadAvailableWarehouseKeepers);
    router.get('/admin/warehouse_keeper/load', admin_Auth, adminController.loadWarehouseKeepers);

    router.post('/warehouse_keeper/storage_location/add', warehouseKeeper_Auth, upload.single('image'), warehouseKeeperController.addStorageLocation);
    router.post('/warehouse_keeper/storage_location/update', warehouseKeeper_Auth, upload.single('image'), warehouseKeeperController.updateStorageLocation);
    router.get('/warehouse_keeper/storage_location/img/:id', warehouseKeeperController.loadStorageLocationImage);
    router.get('/warehouse_keeper/storage_location/load', warehouseKeeper_Auth, warehouseKeeperController.loadStorageLocations);
    router.get('/warehouse_keeper/storage_location/product/load', warehouseKeeper_Auth, warehouseKeeperController.loadStorageLocationProducts);

    router.get('/warehouse_keeper/import/load', warehouseKeeper_Auth, warehouseKeeperController.loadImports);
    router.get('/warehouse_keeper/import/detail/load', warehouseKeeper_Auth, warehouseKeeperController.loadImportDetails);
    router.post('/warehouse_keeper/import/update', warehouseKeeper_Auth, warehouseKeeperController.updateImport);

    router.get('/warehouse_keeper/export/load', warehouseKeeper_Auth, warehouseKeeperController.loadExports);
    router.get('/warehouse_keeper/export/detail/load', warehouseKeeper_Auth, warehouseKeeperController.loadExportDetails);
    router.post('/warehouse_keeper/export/update', warehouseKeeper_Auth, warehouseKeeperController.updateExport);
    router.get('/warehouse_keeper/storage_location/load_byProductId', warehouseKeeper_Auth, warehouseKeeperController.loadStorageLocationsbyProductId);
    

    router.post('/business/product/add', business_Auth, upload.single('image'), businessController.addProduct);
    router.post('/business/product/update', business_Auth, upload.single('image'), businessController.updateProduct);
    router.get('/business/product/load', business_Auth, businessController.loadListProduct);
    router.get('/business/product/img/:id', businessController.loadProductImage);
    router.get('/business/product/prices/', business_Auth, businessController.loadProductPrices);
    router.get('/business/product/report/inventory', business_Auth, businessController.getInventoryReport);
    router.get('/business/product/report/expiryDate', business_Auth, businessController.getExpiryDateReport);

    router.get("/business/product_tag/load", business_Auth, businessController.loadTags);
    router.post("/business/product_tag/add", business_Auth, businessController.addTag);
    router.post("/business/product_tag/update", business_Auth, businessController.updateTag);
    router.get("/business/product_tag/category/load", business_Auth, businessController.loadCategory);
    router.get("/business/product_tag/load_byProductId", business_Auth, businessController.loadProductTags);

    router.get("/business/product_batch/load_byProductId", business_Auth, businessController.loadProductBatchesbyProductId);

    router.post("/business/import/create", business_Auth, businessController.createImport);
    
    router.post("/business/export/create", business_Auth, businessController.createExport);

    return app.use('/', router);

}

export default initWebRoutes;