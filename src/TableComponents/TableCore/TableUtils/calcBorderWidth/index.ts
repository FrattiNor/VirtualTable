import { isMacOrFireFox } from '../index';
import styles from './index.module.less';

const calcBorderWidth = (container: HTMLElement) => {
	// 创建滚动容器
	const calcDom = document.createElement('div');
	calcDom.style.width = '100px';
	calcDom.style.height = '100px';
	calcDom.style.visibility = 'hidden';
	calcDom.style.opacity = '0';
	calcDom.style.zIndex = '-1';
	calcDom.style.overflow = 'scroll';
	calcDom.style.position = 'absolute';
	calcDom.style.top = '0px';
	calcDom.style.left = '0px';
	calcDom.className = !isMacOrFireFox ? styles['scrollbar'] : '';
	// 插入滚动容器
	container.appendChild(calcDom);
	// 创建内部元素
	const calcDomInner = document.createElement('div');
	calcDomInner.style.width = '1000px';
	calcDomInner.style.height = '1000px';
	// 插入内部元素
	calcDom.appendChild(calcDomInner);
	// 滚动到极限位置
	calcDom.scrollTop = 1000;
	calcDom.scrollLeft = 1000;
	// 计算scrollbar宽度
	const vScrollbarWidth1 = calcDom.offsetWidth - calcDom.clientWidth;
	const hScrollbarWidth1 = calcDom.offsetHeight - calcDom.clientHeight;
	const vScrollbarWidth2 = calcDom.offsetWidth - Math.floor(calcDomInner.offsetWidth - calcDom.scrollLeft);
	const hScrollbarWidth2 = calcDom.offsetHeight - Math.floor(calcDomInner.offsetHeight - calcDom.scrollTop);
	// 移除内部元素和滚动容器
	calcDom.removeChild(calcDomInner);
	container.removeChild(calcDom);

	return { vScrollbarWidth: Math.max(vScrollbarWidth1, vScrollbarWidth2), hScrollbarWidth: Math.max(hScrollbarWidth1, hScrollbarWidth2) };
};

export default calcBorderWidth;
