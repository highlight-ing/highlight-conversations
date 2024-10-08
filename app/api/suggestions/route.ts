import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const template = `
{{#system}}
  List the 5 most insightful and impressive tasks that an LLM like
  {{currentApp}}
  could complete for someone with the below screen activity. Tasks should be
  completely achievable within an LLM, based on the information provided. Write
  each task as a concise sentence, maximum 15 words long, without periods at the
  end. Tasks should lean into the unique strengths of
  {{currentApp}}
  versus other LLMs. Format the tasks in a JSON array like this:
  [task1,task2,task3,task4,task5].
{{/system}}

{{#user}}
  # SCREEN ACTIVITY:
  {{#if application.focusedWindow.selectedText}}
    The text that is selected right now:
    {{application.focusedWindow.selectedText}}
  {{/if}}
  {{#if application.focusedWindow.title}}
    The name of the window that is open:
    {{application.focusedWindow.title}}
  {{/if}}
  {{#if application.focusedWindow.domain}}
    The name of the domain on the browser window that is open:
    {{application.focusedWindow.domain}}
  {{/if}}
  {{#if environment.ocrScreenContents}}
    The contents of what is being looked at right now:
    {{environment.ocrScreenContents}}
  {{/if}}
  {{#if application.focusedWindow.rawContents}}
    The contents of everything else on the screen:
    {{application.focusedWindow.rawContents}}
  {{/if}}
  {{#if audioRecent}}
    What I have said and heard recently:
    {{audioRecent}}
  {{/if}}
  {{#if environment.clipboardText}}
    The text I have copied on my clipboard currently:
    {{environment.clipboardText}}
  {{/if}}
  {{#if factsAboutMe}}
    Other facts about the person:
    {{factsAboutMe}}
  {{/if}}
{{/user}}
`

  return new NextResponse(template, {
    headers: { 'Content-Type': 'text/plain' },
  })
}