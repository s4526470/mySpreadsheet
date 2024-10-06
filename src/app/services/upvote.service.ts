import { Injectable, Inject } from '@angular/core';
import { Firestore, collection, addDoc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class UpvoteService {
  private upvotesCollection;

  constructor(@Inject('Firestore') private firestore: Firestore) {
    this.upvotesCollection = collection(this.firestore, 'upvotes');
  }

  addUpvote(upvote: any): Promise<any> {
    return addDoc(this.upvotesCollection, upvote);
  }
}
