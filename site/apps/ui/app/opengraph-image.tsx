import { ogImage, ogSize } from "@/lib/og";
import { site } from "@/lib/site";

export const alt = site.title;
export const size = ogSize;
export const contentType = "image/png";

export default async function OpengraphImage() {
  return ogImage({ title: `Build with ${site.name}.`, description: site.description });
}
