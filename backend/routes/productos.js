const router = require('express').Router();
const ctrl = require('../controllers/productoController');
const upload = require('../middleware/upload');

router.get('/',       ctrl.getAll);
router.get('/:id',    ctrl.getById);
router.post('/',      upload.single('imagen'), ctrl.create);
router.put('/:id',    upload.single('imagen'), ctrl.update);

router.delete('/:id', ctrl.delete);

module.exports = router;