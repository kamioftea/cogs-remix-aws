import Markdown from "markdown-it";

const md = new Markdown();

const mdUnsafe = new Markdown({
  html: true,
  linkify: true,
  typographer: true,
});

export function renderMarkdown(markdown: string): string {
  return md.render(markdown);
}

export function renderMarkdownInline(markdown: string): string {
  return md.renderInline(markdown);
}

export function unsafeRenderMarkdown(markdown: string): string {
  return mdUnsafe.render(markdown);
}

export function unsafeRenderMarkdownInline(markdown: string): string {
  return mdUnsafe.renderInline(markdown);
}
