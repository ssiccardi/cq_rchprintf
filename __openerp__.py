# -*- coding: utf-8 -*-
##############################################################################
#
#    Copyright (C) 2015 CQ creativiquadrati snc di Stefano Siccardi e C.
#
#    This program is free software: you can redistribute it and/or modify
#    it under the terms of the GNU Affero General Public License as
#    published by the Free Software Foundation, either version 3 of the
#    License, or (at your option) any later version.
#
#    This program is distributed in the hope that it will be useful,
#    but WITHOUT ANY WARRANTY; without even the implied warranty of
#    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#    GNU Affero General Public License for more details.
#
#    You should have received a copy of the GNU Affero General Public License
#    along with this program.  If not, see <http://www.gnu.org/licenses/>.
#
##############################################################################

{
    'name': 'Driver for RCH PrintF! XML compatible fiscal printers (TEST)',
    'version': '0.1',
    'category': 'POS, Fiscal, Hardware, Driver',
    'summary': 'RCH PrintF! XML Fiscal Printer Driver',
    'author': 'Stefano Siccardi @ Creativi Quadrati',
    'depends': ['point_of_sale'],
    'data': ['account_statement_view.xml','cq_rchprintf.xml', 'product_view.xml'],
    'installable': True,
    'auto_install': False,
}
# vim:expandtab:smartindent:tabstop=4:softtabstop=4:shiftwidth=4:
