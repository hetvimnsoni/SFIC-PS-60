export interface BhashiniPipelineTask {
  taskType: "translation" | "asr" | "tts";
  config: Record<string, any>;
}

export interface BhashiniPipelinePayload {
  pipelineTasks: BhashiniPipelineTask[];
  inputData: {
    input?: Array<{ source: string }>;
    audio?: Array<{ audioContent: string }>;
  };
}

export interface BhashiniPipelineResponse {
  pipelineResponse?: Array<{
    taskType: string;
    output?: Array<{
      source?: string;
      target?: string;
    }>;
    audio?: Array<{
      audioContent?: string;
    }>;
  }>;
  output?: Array<{
    source?: string;
    target?: string;
  }>;
  audio?: Array<{
    audioContent?: string;
  }>;
}
