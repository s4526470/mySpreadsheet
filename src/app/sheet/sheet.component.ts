import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
// import * as XLSX from 'xlsx';
import * as XLSX from 'xlsx-js-style';
import {MatSelectModule} from '@angular/material/select';
import { Element } from '../element';

type AOA = any[][];
type rule = { ruleId: number, ruleName: string};

@Component({
  selector: 'app-sheet',
  standalone: true,
  imports: [CommonModule, MatSelectModule],
  template: `
    <div class="container">
    <h2 class="text-center mt-4 mb-4">DECHAO FIRST PROJECT</h2>
    <div class="card">
    	<div class="card-header"><b>Select Excel File</b></div>
    	<div class="card-body">
        <input type="file" (change)="onFileChange($event)" multiple="false"  id="excel_file"/>
    	</div>
      <div class="card-body">
        <button (click)="reloadCurrentPage()">Reload SpreadSheet</button>
    	</div>
      <div class="card-body">
        <button (click)="verifyElement()">Verify Elements</button>
    	</div>
      <div class="card-body">
        <button (click)="exportExcel()">Export Excel!</button>
      </div>
    </div>
      <div id="excel_data" class="mt-5">
    </div>
    </div>
  <section class="intro">
  <div class="bg-image h-100" style="background-color: #f5f7fa;">
    <div class="mask d-flex align-items-center h-100">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-12">
            <div class="card">
              <div class="card-body p-0">
                <div class="table-responsive table-scroll" data-mdb-perfect-scrollbar="true" style="position: relative; height: 700px">
                  <table class="table table-striped mb-0">
                    <thead style="background-color: #002d72;">
                      <tr>
                        <th scope="col" *ngFor="let item of columnLengthList">
                          <mat-form-field appearance="fill">
                            <mat-label>Row{{item}}</mat-label>
                            <mat-select (selectionChange)="onChange($event, item)">
                              <mat-option *ngFor="let rule of ruleDict" [value]="rule.ruleId">{{rule.ruleName}}</mat-option>
                            </mat-select>
                          </mat-form-field>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr *ngFor="let row of finalCleanData">
                        <td *ngFor="let element of row" [ngStyle]="setStyle(element.getAgainstRule())">
                        {{element.getElement()}}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  </section>
  `,
  styleUrl: './sheet.component.css'
})



export class SheetComponent implements OnInit{
  
  ruleDict: rule[] = [
    // Objects in the array
    { ruleId: 1, ruleName: 'Only Number'},
    { ruleId: 2, ruleName: 'Not Allow Empty'},
    { ruleId: 3, ruleName: 'No Rule'},
  ];
  // 2D array to store the excel data
  data: AOA = [[1,2,3],['APP',5],[6,,6]];

  // Initialised the element object
  elementObj: Element = new Element(null, false);
  

  // 2D array to store the customized element object 
  finalCleanData: Element[][] = [];

  // Array to store the selected rule from each column
  selectedRuleList: rule[] = [];
  
  // Get the number of columns and arrange increasingly.
  columnLengthList: number[] = this.getColumnLength(this.data);

  // Get the number of columns
  columnNumber = this.columnLengthList.slice(-1)[0];
  
  wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };
  fileName: string = 'SheetJS.xlsx';

  constructor() { }

  ngOnInit() {
    // check whether it was the empty table
    if (this.columnNumber != 0) {
      this.setDefaultRuleList(this.columnNumber);
      this.finalCleanData = this.cutomizedElementObjectArray(this.data, this.columnNumber);
    }
  }

  protected cutomizedElementObjectArray(data: AOA, columnNum: number): Element[][] {
    const tempFinalCleanData: Element[][] = []
    const tempCleanData = this.customizedArray(data, columnNum);
    // const againstRuleList = this.originateAgainstRuleList(tempCleanData);
    for (let i = 0; i < tempCleanData.length; i++) {
      tempFinalCleanData[i] = Array(columnNum);
      for (let j = 0; j < tempCleanData[i].length; j++) {
        tempFinalCleanData[i][j] = new Element(tempCleanData[i][j], false);
      }
    }
    return tempFinalCleanData;
  }

  onFileChange(evt: any) {
    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      this.data = <AOA>(XLSX.utils.sheet_to_json(ws, { header: 1 }));
      
      // Get the colulmnNumber
      this.columnLengthList = this.getColumnLength(this.data);
      this.columnNumber = this.columnLengthList.slice(-1)[0];

      // Customised the data
      this.finalCleanData = this.cutomizedElementObjectArray(this.data, this.columnNumber);

      // set the default rule from each column
      this.setDefaultRuleList(this.columnNumber);
    };
    reader.readAsBinaryString(target.files[0]);
  }

  /* The method to return the numbers of column using list */
  protected getColumnLength(loadedSheet: AOA) {
    const lengthList: number[] = loadedSheet.map((value) => value.length);
    const colNumber = Math.max(...lengthList);
    return Array.from({length: colNumber}, (_, i) => i + 1)
  }

  /* Set each column for default rule */
  protected setDefaultRuleList(columnNumber: number) {
    for (let i = 0; i < columnNumber; i++) {
      this.selectedRuleList[i] = this.ruleDict[2];
    }
  }

   /* Set the rule for each column */
  protected setSelectedRuleList(selectedRuleId: number, columnNumber: number) {
    this.selectedRuleList[columnNumber - 1] = this.ruleDict[selectedRuleId - 1];
  }

   /* Refresh the page */
  reloadCurrentPage() {
    window.location.reload();
   }
  
  // Set the row for each column
  onChange(event: any, columnNumber: number){
    const selectedRuleId = event.value;
    this.setSelectedRuleList(selectedRuleId, columnNumber);
  }

  setStyle(againstRule: boolean) {
    if(againstRule) {
      return {
        'word-wrap': 'break-word',
        'min-width': '160px',
        'max-width': '160px',
        'white-space':'normal',
        'background-color':'#FF204E'
      }
    }
    return {
      'word-wrap': 'break-word',
      'min-width': '160px',
      'max-width': '160px',
      'white-space':'normal',
      
    }
  }

  verifyElement() {
    for (let i = 0; i < this.selectedRuleList.length; i++) {
      if (this.selectedRuleList[i].ruleId == 1) {
        this.verifyIfOnlyNumber(i);
      }
      if (this.selectedRuleList[i].ruleId == 2) {
        this.verifyIfEmpty(i);
      }
      if (this.selectedRuleList[i].ruleId == 3) {
        this.verifyNoRule(i);
      }
    }
  }
  
  protected verifyIfEmpty(columnNumber: number){
    for (var item of this.finalCleanData) {
      // check whether the element was undefined or empty
      if (item[columnNumber].getElement() === undefined || item[columnNumber].getElement() as string === "") {
        item[columnNumber].setAgainstRule(true);
      } else {
        item[columnNumber].setAgainstRule(false);
      }
    }
  }
  protected verifyIfOnlyNumber(columnNumber: number) {
    for (var item of this.finalCleanData) {
      // check whether it can convert the object to number
      if (isNaN(+item[columnNumber].getElement())) {
        item[columnNumber].setAgainstRule(true);
      }
      else {
        item[columnNumber].setAgainstRule(false);
      }
    }
  }

  protected verifyNoRule(columnNumber: number) {
    for (var item of this.finalCleanData) {
      item[columnNumber].setAgainstRule(false);
    }
  }

   /* Return the 2D cutomized array */
  protected customizedArray(data: AOA, columnNum: number): AOA {
    const tempCleanData: AOA = [];
    for (let i = 0; i < data.length; i++) {
      // Let the data become the same length array
      tempCleanData[i] = Array(columnNum);
      for (let j = 0; j < data[i].length; j++) {
        tempCleanData[i][j] = this.data[i][j];
      }
    }
    return tempCleanData;
  }

  exportExcel(): void {
    // STEP 1: Create a new workbook
    const wb = XLSX.utils.book_new();

    // STEP 2: Create data rows and styles
    let outputRow:AOA = [];
    for (var item of this.finalCleanData) {
      const tempElemet = [];
      for (var element of item) {
        if (element.getAgainstRule()) {
          tempElemet.push({v: element.getStringElement(), 
            t: "s", s: { fill: { fgColor: { rgb: "FFFF0000" } } }})
        }
        else {
          tempElemet.push({v: element.getStringElement()})
        }
      }
      outputRow.push(tempElemet);
    }
    // STEP 3: Create worksheet with rows; Add worksheet to workbook
    const ws = XLSX.utils.aoa_to_sheet(outputRow);
    XLSX.utils.book_append_sheet(wb, ws, "readme demo");

    // STEP 4: Write Excel file to browser
    XLSX.writeFile(wb, "output-sheet.xlsx");
  }
}
