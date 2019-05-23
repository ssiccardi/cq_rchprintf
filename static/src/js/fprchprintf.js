openerp_pos_fiscal_rch_print = function(instance) {
	posModule = instance.point_of_sale;

	posModule.PosWidget.include({
		build_widgets: function() {
			this._super();
			var self = this;
			this.close_fiscal = new posModule.HeaderButtonWidget(this, {
				label: instance.web._t('Chiusura fiscale'),
				action: function() {
					var p = new posModule.Driver();
					if ( confirm(instance.web._t('Effettuare davvero la chiusura fiscale?'))) {
						p.printFiscalReport();
						//self.flush();
						//self.pos_widget.close();
						alert('Chiusura finestra di dialogo con la stampante');
					    setTimeout(function(){self.close()},3000);
					}
				},
			});
			this.close_fiscal.appendTo(this.$('.pos-rightheader'));
		}
	});


	/*
	  There are probably about a thousand better ways to do this,
	  but the documentation on fiscal printers drivers is scarce.
	*/
	posModule.ProxyDevice.include({
		print_receipt: function(receipt) {
			var fp90 = new posModule.Driver();
			fp90.printFiscalReceipt(receipt);
		}
	});

	posModule.Driver = instance.web.Class.extend({
		init: function(options) {
			options = options || {};
			url = options.url || 'http://192.168.1.220/service.cgi';
			this.fiscalPrinter = new rch.fiscalPrint();
			this.fiscalPrinter.onreceive = function(res) { // , tag_list_names, add_info) {
// NOTA: res e' la risposta della stampante con lo stato - GESTIRE ERRORI??? COME??
				//console.log(res);
				if (res.errorcode!=0) {
					//var message='Codice Errore: ' + res.errorcode;
					alert('La stampante ha dato un ERRORE: controllare e/o proseguire manualmente!');
				}
	
			}
			this.fiscalPrinter.onerror = function() {
				alert('HTTP/timeout or other net error. This is not a fiscal printer internal error!');
			}
		},

		/*
		  Prints a sale item line.
		*/
		printRecItem: function(args) {
                        //var tag = '<cmd>=R' + (args.department || '1')+'/$'+ (args.unitPrice*100 || '')+'/*'+(args.quantity || '1') +'/('+(args.description || '')+')</cmd>\n';
			            var tag = '<cmd>=R' + (args.department || '1')+'/$'+ (args.unitPrice*100 || '')+'/*'+(args.quantity || '1')+'</cmd>\n'; 
			
			return tag;
		},

		/*
		  Adds a discount to the last line.
		*/
		printRecItemAdjustment: function(args) {
		                tag = '<cmd>=V/*'+ (args.amount*100 || '')+'</cmd>\n'
                        //tag = '<cmd>=V/*'+ (args.amount*100 || '')+'/('+(args.description || '')+')</cmd>\n'
			return tag;
		},

		/*
		  Prints a payment.
		*/
		printRecTotal: function(args) {
		                //tag = '<cmd>=T' + (args.paymentType || '1')+'/$'+ (args.payment*100 || '')+'</cmd>\n';
                        tag = '<cmd>=T' + (args.paymentType || '1')+'/$'+ (args.payment*100 || '')+'/('+(args.description || '')+')</cmd>\n';
			return tag;
		},

		/*
		  Prints a receipt
		*/
		printFiscalReceipt: function(receipt) {
			var self = this;
			var xml = '<Service>';
			_.each(receipt.orderlines, function(l, i, list) {
				xml += self.printRecItem({
					description: l.product_name,
					quantity: l.quantity,
					unitPrice: l.price,
					department: l.department,
				});
				if (l.discount) {
					xml += self.printRecItemAdjustment({
						adjustmentType: 0,
						description: 'Sconto ' + l.discount + '%',
						amount: (l.quantity * l.price - l.price_display).toFixed(2),
					});
				}
			});
			_.each(receipt.paymentlines, function(l, i, list) {
				xml += self.printRecTotal({
					payment: l.amount,
					paymentType: l.type,
					//description: l.journal,
					description: 'Pagamento',  //modifica voluta dal cliente
				});
			});
			xml += '</Service>';
			this.fiscalPrinter.send(url, xml);                        
			//console.log(xml);
		},


		printFiscalReport: function() {
			var xml = '<Service>';
			//xml += '<cmd>=C501/$1</cmd>';
			xml += '<cmd>=C3</cmd>\n';			
			xml += '<cmd>=C10</cmd>\n';
			xml += '</Service>';
			this.fiscalPrinter.send(url, xml);
		},

	});

	/*
	  Overwrite Paymentline.export_for_printing() in order
	  to make it export the payment type that must be passed
	  to the fiscal printer.
	*/
	var original = posModule.Paymentline.prototype.export_for_printing;
	posModule.Paymentline = posModule.Paymentline.extend({
		export_for_printing: function() {
			var res = original.apply(this, arguments);
			res.type = this.cashregister.journal.fiscalprinter_payment_type;
//                        res.type = 1; // contanti
//                        res.type = 3; // assegni?
			return res;
		}
	});

}
