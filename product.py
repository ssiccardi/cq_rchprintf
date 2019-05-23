from openerp.osv import orm, fields

class product_product(orm.Model):

    _inherit = 'product.product'
    
    _columns = {
        'department': fields.integer('Reparto'),
    }
    _defaults = {
        'department': 1,
    }
    

