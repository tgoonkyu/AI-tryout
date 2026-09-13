import {Component, ViewChild, ViewEncapsulation} from '@angular/core';
import {
  AIAssistViewComponent,
  AIAssistViewModule,
  PromptRequestEventArgs,
  ToolbarItemClickedEventArgs,
  ToolbarSettingsModel
} from "@syncfusion/ej2-angular-interactive-chat";

import {defaultPromptResponseData, defaultSuggestions} from './promptResponseData';

import {InputFormComponent} from "./input-form/input-form.component";
import {ChatComponent} from "./chat/chat.component";
import {OpenaiService} from "./services/openai.service";
import {LensInterface} from "./lens/lens.interface";

@Component({
  selector: 'app-root',
  standalone: true,
    imports: [InputFormComponent, ChatComponent, AIAssistViewModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss','chat.css'],
  encapsulation: ViewEncapsulation.None,
})

export class AppComponent {
  title = 'HACK6';
  constructor(private openaiService: OpenaiService) {
  }

  // @ts-ignore
  @ViewChild('defaultAIAssistView') public defaultAIAssistView: AIAssistViewComponent;

  public toolbarSettings: ToolbarSettingsModel = {
    items: [ { iconCss: 'e-icons e-refresh', align: 'Right' } ],
    itemClicked: (args: ToolbarItemClickedEventArgs) => {
      // @ts-ignore
      if (args.item.iconCss === 'e-icons e-refresh') {
        this.defaultAIAssistView.prompts = [];
        this.defaultAIAssistView.promptSuggestions = this.suggestions;
      }
    }
  };

  public prompts: { [key: string]: string | string[] } [] = defaultPromptResponseData;

  public suggestions: string[] = [];

  public promptRequest = (args: PromptRequestEventArgs) => {
    let response;
    setTimeout(() => {
      var foundPrompt = this.prompts.find((promptObj) => promptObj['prompt'] === args.prompt);
      this.openaiService.getChatCompletion(args.prompt as string).subscribe({next: (apiResponse: LensInterface) => {
            response = apiResponse.errors && apiResponse.errors.length > 0? apiResponse.errors.join(", "): 'No errors';
          console.log(apiResponse)
          this.defaultAIAssistView.addPromptResponse(response);
        }})


      // this.defaultAIAssistView.promptSuggestions = foundPrompt!['suggestions'] as string [] || this.suggestions;
    }, 0);
  };
}
