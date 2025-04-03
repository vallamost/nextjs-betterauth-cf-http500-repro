"use client";

import Link from "next/link";
import { ReactElement } from "react";

const Footer = (): ReactElement => (
    <footer className="absolute inset-x-0 bottom-0 px-5 sm:px-0 sm:mx-[calc(10%+1rem)] h-14 flex gap-1 items-center text-sm text-muted-foreground border-t sm:border-none border-dotted border-grid-line">
        © {new Date().getFullYear()}{" "}
        
    </footer>
);
export default Footer;
