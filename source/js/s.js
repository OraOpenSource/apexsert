///////////////////////////////////////////////////////////////////////////
// sv.js version @SV_VERSION@
// JavaScript Support Files for sumnevaSERT
// (c) 2011-12 Sumneva - All Rights Reserved
///////////////////////////////////////////////////////////////////////////

//FUNCTION: svScan
// Initiates the security scan for an application
function svScan(pAppId,pAttributeSetId,pPageId,pRequest)
{
var get = new htmldb_Get(null,$v('pFlowId'),'APPLICATION_PROCESS=initScan',0);
get.addParam('x01',pAttributeSetId);
get.addParam('x02',pAppId);
gReturn = get.get();
setInterval("progress()", 500);
window.location="f?p=" + $v('pFlowId') + ":" + pPageId + ":" + $v('pInstance') + ":" + pRequest;  
d = apex.jQuery('<div id="popup" class="popup"><div class="popupbody"><div id="progressMessage" >Processing - please wait.</div><div id="progressbar" class="ui-progressbar ui-widget ui-widget-content ui-corner-all"></div></div></div>');
d.dialog({
  title: 'Processing Application '+pAppId,
  bgiframe: true,
  width: 400,
  height: 150,
  modal: true,
  draggable: false,
  resizable: false,
  closeOnEscape: true,
  buttons: 
    {
      Cancel: function() 
      { 
      window.location="f?p=" + $v('pFlowId') + ":" + 1 + ":" + $v('pInstance') + ':CANCEL'; 
      }
    }
  })
  $("#progressbar" ).progressbar({
            value: 0
        });
} 

//FUNCTION: apexLink
// Records when someone clicks on an APEX edit link
function apexLink(gPageId, gRP, gLink, gComponent, gCategory)
{
  var get = new htmldb_Get(null,$v('pFlowId'),'APPLICATION_PROCESS=saveApexLink',0);
  get.addParam('x01',gPageId);
  get.addParam('x02',gLink);
  get.addParam('x03',gRP);
  get.addParam('x04',gComponent);
  get.addParam('x05',gCategory);
  var gReturn = get.get();
  var url = 'f?p=4000:' + gPageId + ':' + gApexSession + '::NO:' + gRP +':' + gLink;
  newWin = window.open( url );
}

//FUNCTION: viewSource
// Pops up window for source
function viewSource(pId, pComponentType)
{
  var get = new htmldb_Get(null,$v('pFlowId'),'APPLICATION_PROCESS=viewSource',0);
  get.addParam('x01',pId);
  get.addParam('x02',pComponentType);
  s = get.get().split("~");
  d = apex.jQuery('<div id="apex_item_help_text"><pre class="brush: SERT;">' + s[1]
 + '</pre></div>');
  d.dialog({
    title: s[0],
    bgiframe: true,
    width: 700,
    height: 600,
    modal: true,
    buttons: {
      Close: function() { $( this ).dialog( "close" ); }
		  }
    })            
}

// FUNCTION: getInfo 
// Pops up the Info window for a specific attribute
function getInfo (pAttrId, pAppProc, w, h, pType)
{
  var get = new htmldb_Get(null,$v('pFlowId'),'APPLICATION_PROCESS=' + pAppProc,101);
  get.addParam('x01',pAttrId);
  get.addParam('x02',pType);
  s = get.get().split("|");
  d = apex.jQuery('<div id="apex_item_help_text">' + s[1]
 + "</div>");
  d.dialog({
    title: s[0],
    bgiframe: true,
    width: w,
    height: h,
    modal: true,
    buttons: {
      Close: function() { $( this ).dialog( "close" ); }
		  }
    })            
  }

// FUNCTION progress
function progress()
{
  var get = new htmldb_Get(null,$x('pFlowId').value,'APPLICATION_PROCESS=getProgress',0);
    gReturn = get.get().split('|');
    $x('progressMessage').innerHTML = gReturn[0] + gReturn[1] +"% Complete"; 
    $("#progressbar" ).progressbar("option", "value", parseInt(gReturn[1]));
}

function HtmlEncode(s)
{
  var el = document.createElement("div");
  el.innerText = el.textContent = s;
  s = el.innerHTML;
  delete el;
  return s;
}

// http://harmen.no-ip.org/javascripts/diff/
// http://stackoverflow.com/questions/4462609
function diff_text(text1, text2) {
  var table = '';

  function make_row(x, y, type, text) {
    if (type == ' ') console.log(x, y);
    var row = '<tr';
    if (type == '+') row += ' class="add"';
    else if (type == '-') row += ' class="del"';
    row += '>';

    row += '<td class="lineno">' + y;
    row += '<td class="lineno">' + x;
    row += '<td class="difftext">' + type + ' ' + HtmlEncode(text);

    table += row;
  }

  function get_diff(matrix, a1, a2, x, y) {
    if (x > 0 && y > 0 && a1[y-1] === a2[x-1]) {
      get_diff(matrix, a1, a2, x-1, y-1);
      make_row(x, y, ' ', a1[y-1]);
    }
    else {
      if (x > 0 && (y === 0 || matrix[y][x-1] >= matrix[y-1][x])) {
        get_diff(matrix, a1, a2, x-1, y);
        make_row(x, '', '+', a2[x-1]);
      }
      else if (y > 0 && (x === 0 || matrix[y][x-1] < matrix[y-1][x])) {
        get_diff(matrix, a1, a2, x, y-1);
        make_row('', y, '-', a1[y-1]);
      }
      else {
        return;
      }
    }
  }

  function diff(a1, a2) {
    var matrix = new Array(a1.length + 1);
    var x, y;

    for (y = 0; y < matrix.length; y++) {
      matrix[y] = new Array(a2.length + 1);

      for (x = 0; x < matrix[y].length; x++) {
        matrix[y][x] = 0;
      }
    }
    
    for (y = 1; y < matrix.length; y++) {
      for (x = 1; x < matrix[y].length; x++) {
        if (a1[y-1] === a2[x-1]) {
          matrix[y][x] = 1 + matrix[y-1][x-1];
        }
        else {
          matrix[y][x] = Math.max(matrix[y-1][x], matrix[y][x-1]);
        }
      }
    }

    get_diff(matrix, a1, a2, x-1, y-1);
  }

  diff(text1.split('\n'), text2.split('\n'));

  return '<table class="diff_text">' + table + '</table>';
}

function getDiff(text1, text2)
{
var table = document.getElementById('comparison').innerHTML = diff_text(text1, text2);
}


function showSidebar()
{
 $("#main").animate({marginLeft:"0px",width:"810px"}, 200);
 $("#menu").animate({width:"811px"}, 200);
 $("#left-sidebar").animate({marginLeft:"0px"}, 400 );
 $("#colleft").animate({width:"175px", opacity:1}, 400 );
 $("#showPanel").animate({width:"0px", opacity:0}, 600).hide("slow");
 $("#hidePanel").animate({marginLeft:"0px"}, 500);
 $("#region-subtab-holder").animate({width:"815px"}, 500);
 $("#region-tab-holder").animate({width:"815px"}, 500);
 $("#region-tabs").animate({width:"811px"}, 500);
 $("#nav").animate({width:"800px"}, 500);
}

function hideSidebar(pTime)
{
 $("#left-sidebar").animate({marginLeft:"-200px"}, pTime );
 $("#colleft").animate({width:"0px", opacity:0}, pTime );
 $("#showPanel").show("normal").animate({width:"7px", opacity:1}, pTime);
 $("#main").animate({marginLeft:"-200px",width:"1010px"}, pTime);
 $("#menu").animate({width:"1010px"}, pTime);
 $("#scoreBoard").animate({width:"1010px"}, pTime);
 $("#nav").animate({width:"1010px"}, pTime);
 $("#region-subtab-holder").animate({width:"1015px"}, pTime);
 $("#region-tab-holder").animate({width:"1015px"}, pTime);
 $("#region-tabs").animate({width:"1015px"}, pTime);
 $("#hidePanel").animate({marginLeft:"-210px"}, pTime);	 
}