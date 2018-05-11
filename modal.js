"use strict";

/**
 * こんな感じのモーダル要素をviewにおいて使うこと
 */
// <div>
//   <button class="modal-opener modal-opener__button button--rals-primary">モーダル開始</button>
// </div>
// <div>
//   <div class="modal">
//     <div class="modal__closer circle modal__close-btn--circle">
//       <i class="modal__close-btn--cross material-icons ">clear</i>
//     </div>
//     <div class="modal__content">
//       <div class="address-list">
//         <div class="address__list--level1">
//           <p>ここはモーダルコンテント</p>
//           <p>
//             <button class="remove-btn">閉じるボタン</button>
//           </p>
//         </div>
//       </div>
//     </div>
//   </div>
// </div>

/**
 * DOM読み込み時のイベント処理
 */
document.addEventListener("DOMContentLoaded", function () {
    "use strict";
    console.log("addresslist-DOMContentLoaded");

    // モーダルを開く要素
    var $opener = this.querySelector(".modal-opener");

    // モーダルオブジェクトを生成
    var modal = new Modal(document.querySelector(".modal"), $opener);
});

/**
 * モーダルクラス
 * @param {ModalContent} $modalContent
 * @param {HTMLElement} $opener
 * @constructor
 */
function Modal($modalContent, $opener) {
    "use strict";
    this.content = new ModalContent($modalContent);
    this.remove_btn = $modalContent.querySelector(".modal__closer");

    this.bg = new ModalBg();

    // モーダルの削除イベントを設定
    this.setRemoveEvent();
    // モーダルの展開イベントを設定
    this.setOpenEvent($opener);
}

/**
 * 削除イベントセット
 */
Modal.prototype.setRemoveEvent = function () {
    "use strict";
    var modalbg_obj = this.bg;
    var modalcon_obj = this.content;
    var modalcon_rm_btn_obj = this.remove_btn;
    modalbg_obj.dom.addEventListener("click", function () {
        modalbg_obj.fadeOut();
        modalcon_obj.fadeOut();
    });

    modalcon_rm_btn_obj.addEventListener("click", function () {
        modalbg_obj.fadeOut();
        modalcon_obj.fadeOut();
    });
};
/**
 * 表示イベントセット
 * @param {HTMLElement} $opener
 * @returns {null}
 */
Modal.prototype.setOpenEvent = function ($opener) {
    "use strict";

    // オープナーがDOMじゃない
    if (!($opener instanceof HTMLElement)) {
        console.log("Don't set other than DOMElement in setOpenEvent's arguments: $opener");
        return null;
    }

    // thisをキャッシュ
    var parent = this;

    /**
     * リサイズ条件
     * @type {MediaQueryList}
     */
    var isSp = window.matchMedia("(max-width:640px)");
    var isMid = window.matchMedia("(max-width:800px)");
    var isPc = window.matchMedia("(max-width:1200px)");
    var isLargePc = window.matchMedia("(min-width:1500px)");

    var resizeEvent = function () {
        if (isSp.matches) {
            parent.resize();
            console.log("sp");
        } else if (isMid.matches) {
            parent.resize();
            console.log("mid");
        } else if (isPc.matches) {
            parent.resize();
            console.log("pc");
        } else if (isLargePc.matches) {
            parent.resize();
            console.log("Lpc");
        }
    };

    /**
     * モーダルオープナークリック時のイベント処理
     */
    $opener.addEventListener("click", function () {

        // モーダル位置初期設定
        parent.resize();

        window.removeEventListener("resize", resizeEvent);
        window.addEventListener("resize", resizeEvent);

        // モーダルをフェードイン
        parent.fadeIn();
    });
};

Modal.prototype.fadeIn = function () {
    "use strict";
    this.content.fadeIn();
    this.bg.fadeIn();
};
Modal.prototype.fadeOut = function () {
    "use strict";
    this.content.fadeOut();
    this.bg.fadeOut();
};
Modal.prototype.resize = function () {
    "use strict";
    this.content.resize();
};

/**
 * モーダル内コンテンツオブジェクト
 * @param {HTMLElement} $modalContent
 * @constructor
 */
function ModalContent($modalContent) {
    "use strict";
    this.dom = $modalContent;
    this.animator = Animator;
}

ModalContent.prototype.fadeIn = function () {
    "use strict";
    this.animator.fadeIn(this.dom);
};
ModalContent.prototype.fadeOut = function () {
    "use strict";
    this.animator.fadeOut(this.dom);
};
ModalContent.prototype.resize = function () {
    "use strict";
    var dom = this.dom;

    // ウィンドウのサイズ取得
    var windowW = window.innerWidth;
    var windowH = window.innerHeight;

    var domStatus;
    if (this.isDisplay()) {
        domStatus = dom.getBoundingClientRect();
    } else {
        // モーダルコンテンツのサイズを取得
        dom.style.display = "block";
        domStatus = dom.getBoundingClientRect();
        dom.style.display = "none";
    }

    // モーダルコンテンツの中心座標を取得
    var domx = domStatus.width;
    var domy = domStatus.height;

    // ウィンドウの一辺/2 - モーダルコンテンツ/2 でモーダルが画面中心に行くよう設定
    dom.style.left = (windowW / 2 - domx / 2) + 'px';
    dom.style.top = (windowH / 2 - domy / 2) + 'px';
};
/**
 * モーダルが表示中か判定
 * @returns {boolean}
 */
ModalContent.prototype.isDisplay = function () {
    "use strict";
    return !(this.dom.style.display === "none" || this.dom.style.display === "");
};

/**
 * モーダルバックグラウンドオブジェクト
 * @param $modalBg
 * @constructor
 */
function ModalBg($modalBg) {
    "use strict";
    if ($modalBg === undefined) {
        $modalBg = null;
    }
    this.dom = null;
    this.bgSelector = '.body__background--modal';
    this.animator = Animator;
    this.findOrNew($modalBg);
}

/**
 * バックグラウンドDOMを見つける、もしくは<body>の最後に生成する
 * @param $modalBg
 */
ModalBg.prototype.findOrNew = function ($modalBg) {
    "use strict";
    if ($modalBg === undefined) {
        $modalBg = null;
    }

    if ($modalBg && $modalBg.classList.contains(this.bgSelector)) {
        // 引数にバックグラウンドのDOMが来てたら引数のDOM:$modalBgを使う
        this.dom = $modalBg;
    } else if (document.querySelector(this.bgSelector) != null) {
        // DOMにバックグラウンドが生成されてたら既に設定されてるDOMを使う
        this.dom = document.querySelector(this.bgSelector);
    } else {
        // 引数&DOMにバックグラウンドがないならバックグラウンドDOMを生成
        document.querySelector('body').insertAdjacentHTML('beforeend', '<div class="body__background--modal"></div>');
        this.dom = document.querySelector('.body__background--modal');
    }
};
/**
 * フェードイン
 */
ModalBg.prototype.fadeIn = function () {
    "use strict";
    this.animator.fadeIn(this.dom);
};
/**
 * フェードアウト
 */
ModalBg.prototype.fadeOut = function () {
    "use strict";
    this.animator.fadeOut(this.dom);
};

/**
 * アニメーションを担当するお助けオブジェクト
 * @type {{fadein_class: string, fadeout_class: string, fadeIn: Animator.fadeIn, fadeOut: Animator.fadeOut}}
 */
var Animator = {
    fadein_class: "fadein",
    fadeout_class: 'fadeout',
    fade_time: 10,
    /**
     * 対象要素をフェードイン
     * @param {HTMLElement} $dom
     */
    fadeIn: function ($dom) {
        "use strict";
        if ($dom.classList.contains(this.fadeout_class)) {
            $dom.classList.remove(this.fadeout_class);
        }
        $dom.classList.add(this.fadein_class);

        setTimeout(function () {
            $dom.style.display = "block";
        }, this.fade_time);
    },
    /**
     * 対象要素をフェードアウト
     * @param {HTMLElement} $dom
     */
    fadeOut: function ($dom) {
        "use strict";
        if ($dom.classList.contains(this.fadein_class)) {
            $dom.classList.remove(this.fadein_class);
        }
        $dom.classList.add(this.fadeout_class);
        setTimeout(function () {
            $dom.style.display = "none";
        }, this.fade_time);
    }
};