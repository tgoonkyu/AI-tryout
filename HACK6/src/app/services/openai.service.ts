import { Injectable, OnInit } from '@angular/core';
import { environment } from "../../environment/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map, Observable } from "rxjs";
import { LensParserService } from '../lens/lens-parser.service';
import { LensInterface } from '../lens/lens.interface';

@Injectable({
  providedIn: 'root'
})
export class OpenaiService implements OnInit {

  private apiKey: string = environment.apiKey;
  private initialRolePrompt: string = environment.initialRolePrompt;
  private gptModel: string = environment.gptModel;
  private messages: { role: string, content: string }[] = [];
  ispromptInitialized: boolean = false;

  constructor(
    private readonly httpClient: HttpClient,
    private readonly lensParser: LensParserService
  ) {}

  ngOnInit(): void {
    this.initializeRolePrompt();
  }

  private initializeRolePrompt(): void {
    this.messages.push({
      role: 'system',
      content: this.initialRolePrompt
    });
  }

  getChatCompletion(userInput: string): Observable<LensInterface> {
    if (!this.ispromptInitialized) {
      this.initializeRolePrompt();
      this.ispromptInitialized = true;
    }
    this.messages.push({ role: 'user', content: userInput });
    const headers: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.apiKey
    });
    const data = {
      model: this.gptModel,
      messages: this.messages,
      max_tokens: 150,
      temperature: 0.7
    };

    return this.httpClient.post('https://api.openai.com/v1/chat/completions', data, { headers: headers }).pipe(
      map((response: any) => {
        let content = response?.choices?.[0]?.message?.content;
        // Parse the response content using LensParserService
        content = this.lensParser.parseLensData(content)
        this.messages.push({
          role: 'system',
          content: JSON.stringify(content)
        });
        return content;
      })
    );
  }
}
