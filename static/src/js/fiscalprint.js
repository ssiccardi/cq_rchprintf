//
// RCHPrintF-Print and Fiscal Print API
//
// Version 1.0.0
//
//

(function (window)
{
    //
    // Function: RCHPrintFBuilder constructor
    // Description: initialize an RCHPrintF-Print XML Builder object
    // Parameters:  none
    // Return:      none
    //
    function RCHPrintFBuilder() {
        // properties
        this.message = '';
    }

// tengo solo le funzioni che servono sicuramente:
// funzioni di utilita'



    //
    // Function: regular expressions
    // Description: enumeration check pattern
    //
    var regexFont = /^(font_[abc]|special_[ab])$/;
    var regexAlign = /^(left|center|right)$/;
    var regexColor = /^(none|color_[1-4])$/;
    var regexBarcode = /^(upc_[ae]|[ej]an13|[ej]an8|code(39|93|128)|itf|codabar|gs1_128|gs1_databar_(omnidirectional|truncated|limited|expanded))$/;
    var regexHri = /^(none|above|below|both)$/;
    var regexSymbol = /^(pdf417_(standard|truncated)|qrcode_model_[12]|maxicode_mode_[2-6]|gs1_databar_(stacked(_omnidirectional)?|expanded_stacked))$/;
    var regexLevel = /^(level_[0-8lmqh]|default)$/;
    var regexLine = /^(thin|medium|thick)(_double)?$/;
    var regexDirection = /^(left_to_right|bottom_to_top|right_to_left|top_to_bottom)$/;
    var regexCut = /^(no_feed|feed|reserve)$/;
    var regexDrawer = /^(drawer_1|drawer_2)$/;
    var regexPulse = /^pulse_[1-5]00$/;
    var regexPattern = /^(none|pattern_[a-e]|error|paper_end)$/;

    //
    // Function: getEnumAttr method
    // Description: get a XML attribute from a parameter (enumration)
    // Parameters:
    //      name    string      parameter name
    //      value   string      parameter value
    //      regex   regex       check pattern
    // Return:      string      XML attribute (' name="value"')
    // Throws:      object      invalid parameter
    //
    function getEnumAttr(name, value, regex) {
        if (!regex.test(value)) {
            throw new Error('Parameter "' + name + '" is invalid');
        }
        return ' ' + name + '="' + value + '"';
    }

    //
    // Function: getBoolAttr method
    // Description: get a XML attribute from a parameter (boolean)
    // Parameters:
    //      name    string      parameter name
    //      value   boolean     parameter value
    // Return:      string      XML attribute (' name="value"')
    //
    function getBoolAttr(name, value) {
        return ' ' + name + '="' + !!value + '"';
    }

    //
    // Function: getIntAttr method
    // Description: get a XML attribute from a parameter (integer)
    // Parameters:
    //      name    string      parameter name
    //      value   integer     parameter value
    //      min     integer     minumum value
    //      max     integer     maximum value
    // Return:      string      XML attribute (' name="value"')
    // Throws:      object      invalid parameter
    //
    function getIntAttr(name, value, min, max) {
        if (isNaN(value) || value < min || value > max) {
            throw new Error('Parameter "' + name + '" is invalid');
        }
        return ' ' + name + '="' + value + '"';
    }

    //
    // Function: getUByteAttr method
    // Description: get a XML attribute from a parameter (unsigned byte)
    // Parameters:
    //      name    string      parameter name
    //      value   integer     parameter value
    // Return:      string      XML attribute (' name="value"')
    // Throws:      object      invalid parameter
    //
    function getUByteAttr(name, value) {
        return getIntAttr(name, value, 0, 255);
    }

    //
    // Function: getUShortAttr method
    // Description: get a XML attribute from a parameter (unsigned short)
    // Parameters:
    //      name    string      parameter name
    //      value   integer     parameter value
    // Return:      string      XML attribute (' name="value"')
    // Throws:      object      invalid parameter
    //
    function getUShortAttr(name, value) {
        return getIntAttr(name, value, 0, 65535);
    }

    // Function: RCHPrintFPrint constructor
    // Description: initialize an RCHPrintF-Print object
    // Parameters:  none
    // Return:      none
    //
    function RCHPrintFPrint() {
        // events
        this.onreceive = null;
        this.onerror = null;
        // constants
    }


	/*
	Function: createXMLHttpRequest method
	Description: create an XMLHttpRequest object
	Parameters:  none
	Return:      object      XMLHttpRequest object
	Throws:      object      the browser does not equip XMLHttpRequest
    */
    
	function createXMLHttpRequest()
	{
		var xhr = null;
		if (window.XMLHttpRequest)
		{
			xhr = new XMLHttpRequest();
		}
		else if (window.ActiveXObject)
		{
			xhr = new ActiveXObject('Msxml2.XMLHTTP');
		}
		else
		{
			throw new Error('XMLHttpRequest is not supported');
		}
		return xhr;
	}

    //
// F I S C A L --- F I S C A L --- F I S C A L --- F I S C A L --- F I S C A L

	/*
	Function: fiscalPrint constructor
	Description: initialize a fiscalPrint object
	Parameters:  none
	Return:      none
	*/
	
	function fiscalPrint()
	{
		// events
		this.onreceive = null;
		this.onerror = null;
	    
	}


	/*
	Function: fiscalPrint send method
	Description: send the fiscal RCHPrintF-Print XML message
	Parameters:
		address		string		The address where fpmate.cgi resides
		request		string		Request message
	Return:			none
	Throws:			object		The browser does not equip XMLHttpRequest
	*/
    
	fiscalPrint.prototype.send = function (address, request)
	{
		// create SOAP envelope
		var soap = '<?xml version="1.0" encoding="utf-8"?>\n' +	request;
		// create XMLHttpRequest object
		var xhr = createXMLHttpRequest();
		xhr.open('POST', address, true);
		// set headers
		xhr.setRequestHeader('Content-Type', 'application/xml; charset=UTF-8');
                xhr.setRequestHeader('Content-Length', soap.length);
		// receive event
		var RCHPrintF = this;
		xhr.onreadystatechange = function ()
		{
			// receive response message
			if (xhr.readyState == 4)
			{
				if (xhr.status == 200)
				{
					fireFiscalReceiveEvent(RCHPrintF, xhr);
				}
				else
				{
					fireFiscalErrorEvent(RCHPrintF, xhr);
				}
			}
		}
		// send request message
		xhr.send(soap);
	}


	/*
	Function: fireFiscalReceiveEvent method
	Description: generate the onreceive event
	Parameters:
		RCHPrintF	object		RCHPrintFPrint object
		xhr		object		XMLHttpRequest object
	Return:		none
	*/
	
	function fireFiscalReceiveEvent(RCHPrintF, xhr)
	{
		if (RCHPrintF.onreceive)
		{
			var res = xhr.responseXML.getElementsByTagName('Service');

			// document.write(xhr.responseXML.xml);
		
			if (res.length > 0)
			{
				// fire onreceive event
				var result = 
				{
                                    errorcode: xhr.responseXML.getElementsByTagName('errorCode')[0].innerHTML,
                                    printererror: xhr.responseXML.getElementsByTagName('printerError')[0].innerHTML,
                                    paperend: xhr.responseXML.getElementsByTagName('paperEnd')[0].innerHTML,
                                    coveropen: xhr.responseXML.getElementsByTagName('coverOpen')[0].innerHTML,
                                    lastcmd: xhr.responseXML.getElementsByTagName('lastCmd')[0].innerHTML,
                                    busy: xhr.responseXML.getElementsByTagName('busy')[0].innerHTML
				};
				RCHPrintF.onreceive(result)

			}
			else // res.length <= 0
			{
				// alert ("res.length = " + res.length);
				fireFiscalErrorEvent(RCHPrintF, xhr);
			} // end if (res.length > 0)
		} // end if (RCHPrintF.onreceive)
	} // end function fireFiscalReceiveEvent(RCHPrintF, xhr)


	/*
	Function: fireFiscalErrorEvent method
	Description: generate the onerror event
	Parameters:
		RCHPrintF    object      RCHPrintFPrint object
		xhr     object      XMLHttpRequest object
	Return:      none
	*/

	function fireFiscalErrorEvent(RCHPrintF, xhr)
	{
		// fire onerror event
		// alert("Error event called");
		if (RCHPrintF.onerror)
		{
			RCHPrintF.onerror({
				status: xhr.status,
				responseText: xhr.responseText
			});
		}
	}


    //
    // Function: CanvasPrint constructor
    // Description: initialize a Canvas-Print object
    // Parameters:  none
    // Return:      none
    //

    function CanvasPrint() {
    }
    // inherit from RCHPrintFPrint object
    CanvasPrint.prototype = new RCHPrintFPrint();
    CanvasPrint.prototype.constructor = CanvasPrint;

    //
    // Function: print method
    // Description: print the HTML 5 Canvas
    // Parameters:
    //      address     string      the address of RCHPrintF-Print service
    //      canvas      object      HTML 5 Canvas object
    //      cut         boolean     when true, cut paper [option]
    // Return:          none
    // Throws:          object      the browser does not equip Canvas
    //
    CanvasPrint.prototype.print = function (address, canvas, cut) {
        // check parameter
        if (!canvas.getContext) {
            throw new Error('Canvas is not supported');
        }
        // get HTML 5 Canvas
        var context = canvas.getContext('2d');
        var width = canvas.getAttribute('width');
        var height = canvas.getAttribute('height');
        // create RCHPrintF-Print XML message
        var builder = new RCHPrintFBuilder();
        builder.addImage(context, 0, 0, width, height);
        if (cut) {
            builder.addCut(builder.CUT_FEED);
        }
        // send request message
        this.send(address, builder.toString());
    };

    
	/*
	Function: epson object
	Description: append constructors to window object
	*/
	window.rch = {
		RCHPrintFBuilder: RCHPrintFBuilder,
		RCHPrintFPrint: RCHPrintFPrint,
		fiscalPrint: fiscalPrint,
		CanvasPrint: CanvasPrint
	};

})(window);
