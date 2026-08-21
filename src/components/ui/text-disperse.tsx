'use client';
import { useState } from 'react';
import type { JSX, ComponentProps } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Transform {
	x: number;
	y: number;
	rotationZ: number;
}

/**
 * Disperse transforms for up to 13 characters.
 * Values are in em units relative to font size.
 * Rotation values in degrees.
 */
const transforms: Transform[] = [
	{ x: -0.8, y: -0.6, rotationZ: -29 },
	{ x: -0.2, y: -0.4, rotationZ: -6 },
	{ x: -0.05, y: 0.1, rotationZ: 12 },
	{ x: -0.05, y: -0.1, rotationZ: -9 },
	{ x: -0.1, y: 0.55, rotationZ: 3 },
	{ x: 0, y: -0.1, rotationZ: 9 },
	{ x: 0, y: 0.15, rotationZ: -12 },
	{ x: 0, y: 0.15, rotationZ: -17 },
	{ x: 0, y: -0.65, rotationZ: 9 },
	{ x: 0.1, y: 0.4, rotationZ: 12 },
	{ x: 0, y: -0.15, rotationZ: -9 },
	{ x: 0.2, y: 0.15, rotationZ: 12 },
	{ x: 0.8, y: 0.6, rotationZ: 20 },
];

type TextDisperseProps = ComponentProps<'div'> & {
	/** children should be string (max 13 chars) */
	children: string;
	onHover?: (isActive: boolean) => void;
};

/**
 * Easing function: cubic-bezier(0.33, 1, 0.68, 1)
 * This is ease-out-back — creates a slight overshoot effect.
 */
const EASE_OUT_BACK = [0.33, 1, 0.68, 1] as const;

/**
 * Duration: 0.75s (duration-slow)
 */
const DURATION = 0.75;

export function TextDisperse({
	children,
	onHover,
	className,
	...props
}: Omit<TextDisperseProps, 'onMouseEnter' | 'onMouseLeave'>) {
	const [isAnimated, setIsAnimated] = useState(false);

	const splitWord = (word: string) => {
		const chars: JSX.Element[] = [];
		word.split('').forEach((char, i) => {
			chars.push(
				<motion.span
					custom={i}
					variants={{
						open: (i: number) => ({
							x: transforms[i].x + 'em',
							y: transforms[i].y + 'em',
							rotateZ: transforms[i].rotationZ,
							transition: {
								duration: DURATION,
								ease: EASE_OUT_BACK,
							},
							zIndex: 1,
						}),
						closed: {
							x: 0,
							y: 0,
							rotateZ: 0,
							transition: {
								duration: DURATION,
								ease: EASE_OUT_BACK,
							},
							zIndex: 0,
						},
					}}
					animate={isAnimated ? 'open' : 'closed'}
					key={char + i}
				>
					{char}
				</motion.span>,
			);
		});
		return chars;
	};

	const manageMouseEnter = () => {
		onHover?.(true);
		setIsAnimated(true);
	};

	const manageMouseLeave = () => {
		onHover?.(false);
		setIsAnimated(false);
	};

	return (
		<div
			className={cn(
				"relative flex cursor-pointer justify-between text-[6vw] data-[index='4']:inline-flex data-[index='5']:right-[-40px] data-[index='5']:inline-flex",
				className,
			)}
			onMouseEnter={manageMouseEnter}
			onMouseLeave={manageMouseLeave}
			{...props}
		>
			{splitWord(children)}
		</div>
	);
}
