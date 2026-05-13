'use server';
/**
 * @fileOverview This file implements a Genkit flow that converts natural language descriptions into a structured automation sequence.
 *
 * - generateAutomationFromNaturalLanguage - A function that orchestrates the generation of automation actions.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateAutomationInputSchema = z.object({
  naturalLanguageDescription: z.string().describe('A natural language description of the automation.'),
});

const AutomationActionSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('tap'),
    x: z.number(),
    y: z.number(),
    durationMs: z.number().default(100),
    description: z.string().optional(),
  }),
  z.object({
    type: z.literal('swipe'),
    startX: z.number(),
    startY: z.number(),
    endX: z.number(),
    endY: z.number(),
    durationMs: z.number().default(300),
    description: z.string().optional(),
  }),
  z.object({
    type: z.literal('textInput'),
    text: z.string(),
    description: z.string().optional(),
  }),
  z.object({
    type: z.literal('delay'),
    durationMs: z.number(),
    description: z.string().optional(),
  }),
  z.object({
    type: z.literal('openApp'),
    packageName: z.string(),
    description: z.string().optional(),
  }),
]);

const GenerateAutomationOutputSchema = z.object({
  actions: z.array(AutomationActionSchema),
  summary: z.string().describe('A summary of the generated automation.'),
});

export type GenerateAutomationInput = z.infer<typeof GenerateAutomationInputSchema>;
export type GenerateAutomationOutput = z.infer<typeof GenerateAutomationOutputSchema>;

const generateAutomationPrompt = ai.definePrompt({
  name: 'generateAutomationPrompt',
  input: { schema: GenerateAutomationInputSchema },
  output: { schema: GenerateAutomationOutputSchema },
  prompt: `You are an AI specialized in Android automation for ZAk Version 2.0.
Convert this request into a sequence of actions:
{{{naturalLanguageDescription}}}`,
});

export async function generateAutomationFromNaturalLanguage(input: GenerateAutomationInput): Promise<GenerateAutomationOutput> {
  const { output } = await generateAutomationPrompt(input);
  if (!output) throw new Error("Generation failed");
  return output;
}
