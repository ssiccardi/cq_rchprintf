from openerp.osv import orm, fields

class account_journal(orm.Model):

    _inherit = 'account.journal'
    _columns = {
        'fiscalprinter_payment_type': fields.selection(
            (('1', 'Cash'), ('3', 'Cheque'), ('4', 'Credit Card'), ('5', 'Bancomat')),
            'Payment type',
            help='The payment type to send to the Fiscal Printer.'
        ),
    }
    #_defaults = {
    #    'fiscalprinter_payment_type': '0',
    #}
