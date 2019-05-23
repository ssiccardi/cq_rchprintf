
openerp.point_of_sale = function(instance) {

    instance.point_of_sale = {};

    var module = instance.point_of_sale;

    openerp_pos_db(instance,module);         // import db.js

    //openerp_pos_models(instance,module);     // import pos_models.js

    openerp_pos_modelsval(instance,module);    // import pos_modelsval.js    

    //openerp_pos_basewidget(instance,module); // import pos_basewidget.js

    openerp_pos_basewidget_val(instance,module); // import pos_basewidget_val.js

    openerp_pos_keyboard(instance,module);   // import  pos_keyboard_widget.js

    openerp_pos_screens(instance,module);    // import pos_screens.js

    openerp_pos_screensval(instance,module);    // import pos_screensval.js

    openerp_pos_devices(instance,module);    // import pos_devices.js
    
    openerp_pos_widgets(instance,module);    // import pos_widgets.js
    
    openerp_pos_fiscal_rch_print(instance);                // prova!

    instance.web.client_actions.add('pos.ui', 'instance.point_of_sale.PosWidget');
};

    
