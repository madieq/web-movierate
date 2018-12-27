export class Util {
    static rand(max: number, min: number) {
        return Math.round(Math.random() * (max - min) + min)
    }
    static getNameByRating(rating: any) {
        let segregation = {
            names: ["low", "normal", "good", "high"],
            needRating: [0, 4.5, 6.7, 8.5]
        };
        let res = segregation.names[0];
        segregation.needRating.forEach((need, i) => {
            if (parseFloat(rating) >= need) res = segregation.names[i];
        });
        return res;
    }
    static async sleep(ms: number) {
        return new Promise((resolve, reject) => {
            setInterval(() => { resolve() }, ms)
        })
    }
    static getScrollInfo() {
        let height = document.documentElement.scrollHeight
        return {
            scrollPercent: (((window.pageYOffset + window.innerHeight) / height) * 100),
            height: height,
            pageYOffset: window.pageYOffset,
            innerHeight: window.innerHeight,
            screensInPage: (height / window.innerHeight),
            remainingScreens: (((height - window.innerHeight) - window.pageYOffset) / window.innerHeight)
        }
    }

    static getScrollFull(el: Element) {
        let elInfo = (el.getBoundingClientRect() as DOMRect)
        return {
            element: elInfo,
            document: {
                height: document.documentElement.scrollHeight
            },
            window: {
                pageYOffset: window.pageYOffset,
                innerHeight: window.innerHeight,
            }
        }
    }

    /**
     * return items inside viewport from list with known height items
     * @param options  
     */
    static lookInsideViewport(options: OptionsItemsFor): ItemsOnScreen {
        options.increaseView = options.increaseView ? options.increaseView : 0

        let listHeight = options.count * options.itemHeight;

        let pageOffset = window.pageYOffset - options.increaseView;
        let heightView = window.innerHeight + options.increaseView;

        let first = 0;
        let count = 0;
        let last = 0;

        if (
            pageOffset >= options.listOffsetTop &&
            pageOffset + heightView <= listHeight + options.listOffsetTop
        ) {
            // console.log("INSIDE LIST");
            first = Math.floor(
                (pageOffset - options.listOffsetTop) / options.itemHeight
            );
            last = Math.floor(
                (pageOffset - options.listOffsetTop + heightView) /
                options.itemHeight
            );
            if ((pageOffset + window.innerHeight) % options.itemHeight === 0) count = last - first
            else count = last - first + 1;
        } else if (
            pageOffset < options.listOffsetTop &&
            pageOffset + heightView > options.listOffsetTop
        ) {
            // console.log("TOP PARTIAL OF LIST");
            last = Math.floor(
                (pageOffset - options.listOffsetTop + heightView) /
                options.itemHeight
            );
            first = 0;
            count = last - first + 1;
        } else if (
            pageOffset < listHeight + options.listOffsetTop &&
            pageOffset + heightView > options.listOffsetTop + listHeight
        ) {
            // console.log("BOT PARTIAL OF LIST");
            first = Math.floor(
                (pageOffset - options.listOffsetTop) / options.itemHeight
            );
            last = options.count - 1;
            count = last - first + 1;
        } else {
            // console.log("OUTSIDE OF LIST");
            count = 0;
        }

        return {
            first: first >= 0 ? first : 0,
            count: count + first <= options.count ? count : last - first,
            last: last,
        };
    }

}

export class Debouncer {
    private debounceData = { isWait: false, timer: null, executeAfter: null }
    async debounceAsync(func: (...args: any) => Promise<any>, ms: number, options?: { executeAfter: boolean }) {
        options = options ? options : { executeAfter: false }
        if (!this.debounceData.isWait) {
            this.debounceData.isWait = true
            await func()
            await Util.sleep(ms)
            this.debounceData.isWait = false
            if (this.debounceData.executeAfter) {
                this.debounceAsync(this.debounceData.executeAfter, ms, options)
                this.debounceData.executeAfter = null
            }
        } else if (options.executeAfter) {
            this.debounceData.executeAfter = func
        }
    }
}

/**
 * count - length of list
 * itemHeight - height items in px
 * listOffsetTop - offset top for list
 * increaseView (optional) increasing look by px on top and bottom view side
 */
export interface OptionsItemsFor {
    count: number;
    itemHeight: number;
    listOffsetTop: number;
    increaseView?: number;
}

export interface ItemsOnScreen {
    first: number;
    count: number;
    last: number;
}