

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

        
        if(itemStyle.flex) {
            flexLine.push(item);
        }else if(style.flexWrap === 'nowrap' && isAutoMainSize) {
            mainSpace -= itemStyle[mainSize];
            if(itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0)) {
                crossSpace = Math.max(crossSpace, itemStyle[crossSize]);

            }

            flexLine.push(item);
        }else {
            if(itemStyle[mainSize] > style[mainSize]) {
                itemStyle[mainSize] = style[mainSize];
            }

            if(mainSpace < itemStyle[mainSize]) {
                flexLine.mainSpace = mainSpace;
                flexLine.crossSpace = crossSpace;

                flexLine = [];
                flexLines.push(flexLine);
                flexLine.push(item);

                mainSpace = style[mainSize];
                crossSpace = 0;
            }else {
                flexLine.push(item);
            }

            if(itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0)) {
                crossSpace = Math.max(crossSpace, itemStyle[crossSize]);
            }

            mainSpace -= itemStyle[mainSize];
        }
    }

    flexLine.mainSpace = mainSpace;

    if(style.flexWrap === 'nowrap' || isAutoMainSize) {
        flexLine.crossSpace = (style[crossSize] !== (void 0)) ? style[crossSize] : crossSpace;

    }else {
        flexLine.crossSpace = crossSpace;
    }

    if(mainSpace < 0 ) {
        let scale = style[mainSize] / (style[mainSize] - mainSpace);
        let currentMain = mainBase;

        for(let i = 0; i < items.length; i++) {
            let item = item[i];
            let itemStyle = getStyle(item);

            if(itemStyle.flex) {
                itemStyle[mainSize] = 0;
            }

            itemStyle[mainSize] = itemStyle[mainSize] * scale;

            itemStyle[mainStart] = currentMain;
            itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize];
            currentMain = itemStyle[mainEnd];
        }
    }else {
        flexLines.forEach(function(items){
            var mainSpace = items.mainSpace;
            var flexTotal = 0;

            for(let i =0; i < items.length; i++) {
                let item = item[i];
                let itemStyle = getStyle(item);
                if(itemStyle.flex !== null && itemStyle.flex !== (void 0)) {
                    flexTotal += itemStyle.flex;
                    continue;
                }
            }

            if(flexTotal > 0) {
                let currentMain = mainSpace;
                for(let i =0; i < items.length; i++) {
                    let item = item[i];
                    let itemStyle = getStyle(item);
                    if(itemStyle.flex) {
                       itemStyle[mainSize] = (mainSpace / flexTotal) * itemStyle.flex;
                    }
                    itemStyle[mainStart] = currentMain;
                    itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize];
                    currentMain = itemStyle[mainEnd];

                }
                
            }else {
                let currentMain;
                let step;
                if(style.justifyContent === 'flex-start') {
                    currentMain = mainBase;
                    step = 0;
                }
                if(style.justifyContent === 'flex-end') {
                    currentMain = mainSpace * mainSign + mainBase;
                    step = 0;
                }
                if(style.justifyContent === 'center') {
                    currentMaiin = mainSpace / 2 * mainSign + mainBase;
                    step = 0;
                }
                if(style.justifyContent === 'space-between') {
                    step = mainSpace / (items.length -1) * mainSign;
                    current = step / 2 + mainBase;
                }

                if(style.justifyContent === 'space-around') {
                    step = mainSpace / items.length * mainSign;
                    currentMain = step / 2 + mainBase;
                }

                for(let i = 0; i < items.length; i++) {
                    let item = items[i];
                    itemStyle[mainStart] = currentMain;
                    itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize];
                    currentMain = itemStyle[mainEnd] + step;

                }
            }
        }) 
    }

    let crossSpace;
    if(!style[crossSize]) {
        crossSpace = 0;
        eleStyle[crossSize] = 0;
        for(let i = 0; i < flexLines.length; i++) {
            eleStyle[crossSize] = eleStyle[crossSize] + flexLines[i].crossSpace;
        }
    }else {

        crossSpace = style[crossSize];
        for(let i = 0; i < flexLines.length; i++) {
            crossSpace -= flexLines[i].crossSpace;
        }
    } 

    if(style.flexWrap === 'wrap-reverse') {
        crossBase = style[crossSize];
    }else {
        crossBase = 0;
    }

    let lineSize = style[crossSize] / flexLines.length;
    let step;

    if(style.alginContent === 'flex-start' || style.alginContent === 'stretch') {
        crossBase += 0;
        step = 0;
    }
    if(style.alginContent === 'flex-end') {
        crossBase += crossSign * crossSpace;
        step = 0;
    }
    if(style.alginContent === 'center') {
        crossBase += crossSign * crossSpace / 2; 
        step = 0;
    }
    if(style.alginContent === 'space-between') {
        crossBase += 0; 
        step = crossSpace / (flexLines.length - 1);
    }
    if(style.alginContent === 'space-around') {
        step = crossSpace / (flexLines.length - 1);
        crossBase += crossSign * step / 2; 
    }

    flexLines.forEach(function(items) {
        var lineCrossSize = style.alignContent === 'stretch' ? 

        items.crossSpace + crossSpace / flexLines.length :
        items.crossSpace;


        for(let i = 0; i < items.length; i++) {
            let item = items[i];
            let itemStyle = getStyle(item);

            let align = itemStyle.alignSelf || style.alignItems;

            if(itemStyle[crossSize] === null) {
                itemStyle[crossSize] = (algin === 'stretch') ? 
                lineCrossSize : 0;
            }

            if(align === 'flex-start') {
                itemStyle[crossStart] = crossBase;
                itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * itemStyle[crossSize];
            }else if(align === 'flex-end') {
                itemStyle[crossEnd] = crossBase + crossSign * lineCrossSize;
                itemStyle[crossStart] = itemStyle[end] - crossSign * itemStyle[crossSize];
            }else if(align === 'center') {
                itemStyle[crossStart] = crossBase + crossSign * (lineCrossSize - itemStyle[crossSize]) / 2;
                itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * itemStyle[crossSize];
            }else if(align === 'stretch') {
                itemStyle[crossStart] = crossBase;
                itemStyle[crossEnd] = crossBase + crossSign * ((itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0)) ? itemStyle[crossSize] : lineCrossSize);
            
                itemStyle[crossSize] = crossSign * (itemStyle[crossEnd] - itemStyle[crossStart]);
            }

        }

        crossBase += crossSign * (lineCrossSize + step);

    })
    // console.log(items)

}


module.exports = layout;