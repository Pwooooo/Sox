export type NvloDocument = Record<string, any>

export function createStarterWorld(_name?: string): NvloDocument {
  return {}
}

export class NoveloViewport {
  constructor(_container: HTMLElement, _options?: Record<string, any>) {}
  loadDocument(_doc: NvloDocument): void {}
  setPlayMode(_enabled: boolean): void {}
  dispose(): void {}
}
