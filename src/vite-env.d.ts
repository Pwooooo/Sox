/// <reference types="vite/client" />

declare module '*.css' {}

declare module '@engine/index' {
  export type NvloDocument = Record<string, any>
  export function createStarterWorld(name?: string): NvloDocument
  export class NoveloViewport {
    constructor(container: HTMLElement, options?: Record<string, any>)
    loadDocument(doc: NvloDocument): void
    setPlayMode(enabled: boolean): void
    dispose(): void
    [key: string]: any
  }
}
