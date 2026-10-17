"use client";

import { Signature, type SignatureVariant } from "@registry/textlab/signature/signature";
import type { DemoProps } from "./registry";

export default function SignatureDemo({ variant, props }: DemoProps) {
  return <Signature {...props} text={(props.text as string) ?? "Ada Lovelace"} variant={variant as SignatureVariant} className="text-[clamp(3.5rem,10vw,6.5rem)]" />;
}
