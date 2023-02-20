import SUMMARY_FUNCTIONS from '../enums/summaryFunctions';

export default function calculateSummary({cards, summary}) {
  return SUMMARY_FUNCTIONS[summary.function].call(cards, summary.options);
}
