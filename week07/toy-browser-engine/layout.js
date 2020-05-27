

function getStyle(element) {
    if(!element.style) {
        element.style = {}
    }

    for(let prop in element.computedStyle) {
        element.style[prop] = element.computedStyle[prop].value;

        if(element.style[prop].toString().match(/px$/)) {
            element.style[prop] = parseInt(element.style[prop]);
        }

        if(element.style[prop].toString().match(/^[0-9\.]+$/)) {
            element.style[prop] = parseInt(element.style[prop]);

        }
    }

    return element.style;
}

function layout(ele) {
    if(!ele.computedStyle) return;

    let eleStyle = getStyle(ele);

    if(eleStyle.display !== 'flex') return;

    let items = ele.children.filter( e => e.type === 'element');
    items.sort(function(a, b) {
        return (a.order || 0) - (b.order || 0);
    });

    let style = eleStyle;
    ['width', 'height'].forEach( size => {
        if(style[size] === 'auto' || style[size] === '') {
            style[size] = null;
        }
    });

    if(!style.flexDirection || style.flexDirection === 'auto') {
        style.flexDirection = 'row';
    }
    if(!style.alignItems || style.alignItems === 'auto') {
        style.alignItems = 'stretch';
    } 
    if(!style.justifyContent || style.justifyContent === 'auto') {
        style.justifyContent = 'flex-start'
    }
    if(!style.flexWrap || style.flexWrap === 'auto') {
        style.flexWrap = 'nowrap';
    }
    if(!style.alignContent || style.alignContent === 'auto') {
        style.alignItems = 'stretch';
    }

    var mainSize, mainStart, mainEnd, mainSign, mainBase,
        crossSize, crossStart, crossEnd, corssSign, corrsBase;

    if(style.flexDirection === 'row') {
        mainSize = 'width';
        mainStart = 'left';
        marinEnd = 'right';
        mainSign = +1;
        mainBase = 0;

        crossSize = 'height';
        crossStart = 'top';
        crossEnd = 'bottom';
    }


    if(style.flexDirection === 'row-reverse') {
        mainSize = 'width';
        mainStart = 'right';
        marinEnd = 'left';
        mainSign = -1;
        mainBase = style.width;

        crossSize = 'height';
        crossStart = 'top';
        crossEnd = 'bottom';
    }


    if(style.flexDirection = 'column') {
        mainSize = 'height';
        mainStart = 'top';
        marinEnd = 'bottom';
        mainSign = +1;
        mainBase = 0;

        crossSize = 'width';
        crossStart = 'left';
        crossEnd = 'right';
    }

    if(style.flexDirection = 'column-reverse') {
        mainSize = 'height';
        mainStart = 'top';
        marinEnd = 'bottom';
        mainSign = -1;
        mainBase = style.height;

        crossSize = 'width';
        crossStart = 'left';
        crossEnd = 'right';
    }

    if(style.flexWrap === 'wrap-reverse') {
        let tmp = crossStart;
        crossStart = crossEnd;
        crossEnd = tmp;
        crossSign = -1;
    }else {
        crossBase = 0;
        crossSign = 1;
    }

    var isAutoMainSize = false;

    if(!style.mainSize) {
        eleStyle.mainSize = 0;
        for(let i = 0; i < items.length; i++) {
            let item = items[i];
            let itemStyle = getStyle(item);
            if(itemStyle[mainSize] !== null || itemStyle[mainSize] !== (void 0)) {
                eleStyle[mainSize] = eleStyle[mainSize] + itemStyle[mainSize];
            }
        }
        isAutoMainSize = true;
    }

    var flexLine = [];
    var flexLines = [flexLine];

    var mainSpace = eleStyle[mainSize];
    var crossSpce = 0;

    for(let i = 0; i < items.length; i++) {
        let item = items[i];
        let itemStyle = getStyle(item);

        
    }

}


module.exports = layout;