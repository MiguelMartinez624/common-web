import {Attribute, WebComponent} from "@commonweb/core";


@WebComponent({
    selector: `cw-comment-item`,
    //language=HTML
    template: `
        <div class="comment">
            <span class="tip tip-left"></span>
            <div class="message">
             <span>
                {{@host:[data.content]}}
             </span>
            </div>
        </div>
    `,
    // language=CSS
    style: `
        .comment {
            position: relative;
            max-width: 300px;
            height: auto;
            margin: 20px 10px;
            padding: 5px;
            background-color: #2d3a5b;
            border-radius: 3px;
            border: 2px solid #556282;

        }


        .message {
            min-height: 30px;
            border-radius: 3px;
            font-family: Arial;
            font-size: 14px;
            line-height: 1.5;
            color: #c2c6d0;
        }

        .tip {
            width: 0px;
            height: 0px;
            position: absolute;
            background: transparent;
            border: 10px solid #556282;
        }

        .tip-left {
            top: 10px;
            left: -21px;
            border-top-color: transparent;
            border-left-color: transparent;
            border-bottom-color: transparent;
        }


    `
})
export class CommentComponent extends HTMLElement {
    public data: { content: string, date: Date };


}


@WebComponent({
    selector: `cw-comments-box`,
    //language=HTML
    template: `
        <div>

            <div class="dialogbox">
                <h4>Comments</h4>
                <template for-each="@host:[comments]">
                    <cw-comment-item data="{{@host:[data]}}"></cw-comment-item>
                </template>
            </div>
        </div>
    `,
    // language=CSS
    style: `
        .dialogbox {
            position: relative;
            max-width: 300px;
            height: auto;
            margin: 20px 10px;
            padding: 5px;
            background-color: #2d3a5b;
            border-radius: 3px;
        }



    `
})
export class CommentsBoxComponent extends HTMLElement {
    public comments: { content: string, date: Date }[] = [];
}
