import { binarySearch, getEmptyState, getSizeList } from './utils';

import type { VirtualInnerProps, VirtualProps, VirtualState } from './type';

class VirtualCore {
	state: VirtualState = getEmptyState();
	props: VirtualInnerProps = { enabled: true } as VirtualInnerProps;

	// 初始化
	constructor(virtual?: VirtualCore) {
		if (virtual) {
			this.props = virtual.props;
			this.state = virtual.state;
		}
	}

	// 更新sizeList，同时触发更新totalSize
	private updateSizeList() {
		// 更新sizeList
		this.state.sizeList = getSizeList({
			gap: this.props.gap,
			count: this.props.count,
			keyName: this.props.keyName,
			getItemKey: this.props.getItemKey,
			getItemSize: this.props.getItemSize,
		});
		// 获取最新的totalSize
		const totalSize = (() => {
			if (Array.isArray(this.state.sizeList) && this.state.sizeList.length > 0)
				return this.state.sizeList[this.state.sizeList.length - 1].nextStart;
			return null;
		})();
		//
		return { totalSize };
	}

	// 获得range
	private getRange() {
		return (() => {
			if (
				typeof this.state.scrollOffset === 'number' &&
				typeof this.state.containerSize === 'number' &&
				Array.isArray(this.state.sizeList) &&
				this.state.sizeList.length > 0
			) {
				const _startIndex = binarySearch({
					startIndex: 0,
					endIndex: this.props.count - 1,
					getSize: (i) => this.state.sizeList?.[i].start ?? 0,
					target: this.state.scrollOffset,
				})[0];
				const _endIndex = binarySearch({
					startIndex: _startIndex,
					endIndex: this.props.count - 1,
					getSize: (i) => this.state.sizeList?.[i].end ?? 0,
					target: this.state.scrollOffset + this.state.containerSize,
				})[1];
				const startIndex = Math.max(0, _startIndex - (this.props.overscan?.[0] ?? 0));
				const endIndex = Math.min(this.props.count - 1, _endIndex + (this.props.overscan?.[1] ?? 0));
				return { start: startIndex, end: endIndex };
			}
			return { start: null, end: null };
		})();
	}

	// 触发更新
	private emitChange({ isScroll }: { isScroll: boolean }) {
		if (typeof this.props.onChange === 'function') {
			this.props.onChange({
				range: { start: this.state.rangeStart, end: this.state.rangeEnd, isScroll },
				containerSize: this.state.containerSize,
				scrollOffset: this.state.scrollOffset,
				totalSize: this.state.totalSize,
			});
		}
	}

	// 触发更新end
	private maybeEnd() {
		let changed = false;
		const emptyState = getEmptyState();
		const { totalSize, rangeStart, rangeEnd, scrollOffset, containerSize } = emptyState;
		if (
			this.state.totalSize !== totalSize ||
			this.state.rangeStart !== rangeStart ||
			this.state.rangeEnd !== rangeEnd ||
			this.state.scrollOffset !== scrollOffset ||
			this.state.containerSize !== containerSize
		) {
			changed = true;
		}
		this.state = emptyState;
		if (changed === true) {
			this.emitChange({ isScroll: false });
		}
	}

	// 触发更新1【range和totalSize更新、属于直接数据更新】
	private maybeChange1(arg: { range?: { start: number | null; end: number | null; isScroll: boolean }; totalSize?: number | null }) {
		let changed = false;
		let isScroll = false;
		const { range, totalSize } = arg;
		if (totalSize !== undefined && this.state.totalSize !== totalSize) {
			this.state.totalSize = totalSize;
			changed = true;
		}
		if (range !== undefined && (this.state.rangeStart !== range.start || this.state.rangeEnd !== range.end)) {
			this.state.rangeStart = range.start;
			this.state.rangeEnd = range.end;
			isScroll = range.isScroll;
			changed = true;
		}
		if (changed === true) {
			this.emitChange({ isScroll });
		}
	}

	// 触发更新2【scrollOffset和containerSize更新、属于间接数据更新】
	private maybeChange2(arg: { scrollOffset?: number; containerSize?: number | null }) {
		let changed = false;
		let isScroll = false;
		const { scrollOffset, containerSize } = arg;
		if (scrollOffset !== undefined && this.state.scrollOffset !== scrollOffset) {
			this.state.scrollOffset = scrollOffset;
			isScroll = true;
			changed = true;
		}
		if (containerSize !== undefined && this.state.containerSize !== containerSize) {
			this.state.containerSize = containerSize;
			changed = true;
		}
		if (changed === true) {
			const { start, end } = this.getRange();
			this.state.rangeStart = start;
			this.state.rangeEnd = end;
			this.emitChange({ isScroll });
		}
	}

	// 更新props【外部使用】，用于更新props，并触发一系列修改
	updateProps(props: VirtualProps) {
		// 判断propsChanged
		const enabledChanged = (props.enabled ?? true) !== (this.props.enabled ?? true);
		const countChanged = props.count !== this.props.count;
		const overscanChanged = props.overscan?.[0] !== this.props.overscan?.[0] || props.overscan?.[1] !== this.props.overscan?.[1];
		const gapChanged =
			props.gap?.itemGap !== this.props.gap?.itemGap ||
			props.gap?.startGap !== this.props.gap?.startGap ||
			props.gap?.endGap !== this.props.gap?.endGap;
		const getItemKeyChanged = props.getItemKey !== this.props.getItemKey;
		const getItemSizeChanged = props.getItemSize !== this.props.getItemSize;
		// 更新props
		this.props = {
			...props,
			enabled: props.enabled ?? true,
		};
		//
		if (enabledChanged) {
			if ((this.props.enabled ?? true) === true) {
				const { totalSize } = this.updateSizeList();
				const { start, end } = this.getRange();
				this.maybeChange1({ range: { start, end, isScroll: false }, totalSize });
			} else {
				// end
				this.maybeEnd();
			}
			return;
		}
		if (this.props.enabled === true) {
			if (countChanged || getItemKeyChanged || getItemSizeChanged || gapChanged) {
				const { totalSize } = this.updateSizeList();
				const { start, end } = this.getRange();
				this.maybeChange1({ range: { start, end, isScroll: false }, totalSize });
				return;
			}
			if (overscanChanged) {
				const { start, end } = this.getRange();
				this.maybeChange1({ range: { start, end, isScroll: false } });
				return;
			}
		}
	}

	// 更新容器size【外部使用】
	updateContainerSize(size: number | null) {
		this.maybeChange2({ containerSize: size });
	}

	// 更新滚动offset【外部使用】
	updateScrollOffset(offset: number) {
		this.maybeChange2({ scrollOffset: offset });
	}
}

export default VirtualCore;
