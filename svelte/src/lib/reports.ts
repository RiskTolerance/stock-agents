export interface ReportRoot {
	status: string;
	steps: Steps;
	result: Result;
}

export interface Steps {
	input: Input;
	'layer1-data-collection': Layer1DataCollection;
	'layer2-reasoning': Layer2Reasoning;
	'layer3-rebuttal': Layer3Rebuttal;
	'layer4-decision': Layer4Decision;
}

export interface Input {
	symbol: string;
}

export interface Layer1DataCollection {
	payload: Payload;
	startedAt: number;
	status: string;
	output: Output;
	endedAt: number;
}

export interface Payload {
	symbol: string;
}

export interface Output {
	symbol: string;
	layer1_data: Layer1Data;
}

export interface Layer1Data {
	analyst: string;
	company_summary: string;
	insider: string;
	news: string;
	technical: string;
	balance_sheet: string;
	balance_sheet_growth: string;
	cash_flow: string;
	cash_flow_growth: string;
	income_statement: string;
	key_metrics: string;
	other_statement: string;
}

export interface Layer2Reasoning {
	payload: Payload2;
	startedAt: number;
	status: string;
	output: Output2;
	endedAt: number;
}

export interface Payload2 {
	symbol: string;
	layer1_data: Layer1Data2;
}

export interface Layer1Data2 {
	analyst: string;
	company_summary: string;
	insider: string;
	news: string;
	technical: string;
	balance_sheet: string;
	balance_sheet_growth: string;
	cash_flow: string;
	cash_flow_growth: string;
	income_statement: string;
	key_metrics: string;
	other_statement: string;
}

export interface Output2 {
	symbol: string;
	layer1_data: Layer1Data3;
	layer2_reasoning: Layer2Reasoning2;
}

export interface Layer1Data3 {
	analyst: string;
	company_summary: string;
	insider: string;
	news: string;
	technical: string;
	balance_sheet: string;
	balance_sheet_growth: string;
	cash_flow: string;
	cash_flow_growth: string;
	income_statement: string;
	key_metrics: string;
	other_statement: string;
}

export interface Layer2Reasoning2 {
	bullish: string;
	bearish: string;
}

export interface Layer3Rebuttal {
	payload: Payload3;
	startedAt: number;
	status: string;
	output: Output3;
	endedAt: number;
}

export interface Payload3 {
	symbol: string;
	layer1_data: Layer1Data4;
	layer2_reasoning: Layer2Reasoning3;
}

export interface Layer1Data4 {
	analyst: string;
	company_summary: string;
	insider: string;
	news: string;
	technical: string;
	balance_sheet: string;
	balance_sheet_growth: string;
	cash_flow: string;
	cash_flow_growth: string;
	income_statement: string;
	key_metrics: string;
	other_statement: string;
}

export interface Layer2Reasoning3 {
	bullish: string;
	bearish: string;
}

export interface Output3 {
	symbol: string;
	layer1_data: Layer1Data5;
	layer2_reasoning: Layer2Reasoning4;
	layer3_rebuttals: Layer3Rebuttals;
}

export interface Layer1Data5 {
	analyst: string;
	company_summary: string;
	insider: string;
	news: string;
	technical: string;
	balance_sheet: string;
	balance_sheet_growth: string;
	cash_flow: string;
	cash_flow_growth: string;
	income_statement: string;
	key_metrics: string;
	other_statement: string;
}

export interface Layer2Reasoning4 {
	bullish: string;
	bearish: string;
}

export interface Layer3Rebuttals {
	bullish: string;
	bearish: string;
}

export interface Layer4Decision {
	payload: Payload4;
	startedAt: number;
	status: string;
	output: Output4;
	endedAt: number;
}

export interface Payload4 {
	symbol: string;
	layer1_data: Layer1Data6;
	layer2_reasoning: Layer2Reasoning5;
	layer3_rebuttals: Layer3Rebuttals2;
}

export interface Layer1Data6 {
	analyst: string;
	company_summary: string;
	insider: string;
	news: string;
	technical: string;
	balance_sheet: string;
	balance_sheet_growth: string;
	cash_flow: string;
	cash_flow_growth: string;
	income_statement: string;
	key_metrics: string;
	other_statement: string;
}

export interface Layer2Reasoning5 {
	bullish: string;
	bearish: string;
}

export interface Layer3Rebuttals2 {
	bullish: string;
	bearish: string;
}

export interface Output4 {
	decision: string;
	context: Context;
}

export interface Context {
	symbol: string;
	layer1_data: Layer1Data7;
	layer2_reasoning: Layer2Reasoning6;
	layer3_rebuttals: Layer3Rebuttals3;
}

export interface Layer1Data7 {
	analyst: string;
	company_summary: string;
	insider: string;
	news: string;
	technical: string;
	balance_sheet: string;
	balance_sheet_growth: string;
	cash_flow: string;
	cash_flow_growth: string;
	income_statement: string;
	key_metrics: string;
	other_statement: string;
}

export interface Layer2Reasoning6 {
	bullish: string;
	bearish: string;
}

export interface Layer3Rebuttals3 {
	bullish: string;
	bearish: string;
}

export interface Result {
	decision: string;
	context: Context2;
}

export interface Context2 {
	symbol: string;
	layer1_data: Layer1Data8;
	layer2_reasoning: Layer2Reasoning7;
	layer3_rebuttals: Layer3Rebuttals4;
}

export interface Layer1Data8 {
	analyst: string;
	company_summary: string;
	insider: string;
	news: string;
	technical: string;
	balance_sheet: string;
	balance_sheet_growth: string;
	cash_flow: string;
	cash_flow_growth: string;
	income_statement: string;
	key_metrics: string;
	other_statement: string;
}

export interface Layer2Reasoning7 {
	bullish: string;
	bearish: string;
}

export interface Layer3Rebuttals4 {
	bullish: string;
	bearish: string;
}
