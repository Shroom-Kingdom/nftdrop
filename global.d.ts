declare module "*.mdx" {
  const res: React.FC;
  export default res;
}

declare global {
  namespace NodeJS {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface ProcessEnv {}
  }
}
