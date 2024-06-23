export class Element {
    private element: any;
    private againstRule: boolean;

    constructor(element: any, againstRule: boolean) {
        this.element = element;
        this.againstRule = againstRule;
    }

    getElement(): any {
        return this.element;
    }

    setElement(element: any) {
        this.element = element;
    }

    getAgainstRule(): boolean {
        return this.againstRule;
    }

    setAgainstRule(againstRule: boolean) {
        this.againstRule = againstRule;
    }

    getStringElement(): string {
        if (this.element == undefined || this.element as string === "") {
            return "";
        }
        return this.element.toString();
    }
}