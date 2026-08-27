import { Rubric, RubricCriterion } from '../../types/lms';

export interface CriterionEvaluation {
  criterionId: string;
  criterionTitle: string;
  maxPoints: number;
  estimatedScore: number;
  performanceLevel: string;
  strengths: string[];
  growthAreas: string[];
  matchedKeywords: string[];
}

export interface RubricEvaluationReport {
  rubricId: string;
  rubricTitle: string;
  totalPossiblePoints: number;
  totalEstimatedScore: number;
  percentageScore: number;
  overallSummary: string;
  criteriaEvaluations: CriterionEvaluation[];
  actionableRecommendations: string[];
}

export function evaluateDraftAgainstRubricLogic(
  rubric: Rubric,
  draftText: string
): RubricEvaluationReport {
  const normalizedText = draftText.toLowerCase();
  const wordCount = draftText.trim().split(/\s+/).filter(Boolean).length;

  let totalScore = 0;
  const criteriaEvaluations: CriterionEvaluation[] = [];
  const actionableRecommendations: string[] = [];

  for (const criterion of rubric.criteria) {
    const criterionTitleLower = criterion.title.toLowerCase();
    let scoreRatio = 0.6; // default baseline
    const strengths: string[] = [];
    const growthAreas: string[] = [];
    const matchedKeywords: string[] = [];

    // Contextual heuristics based on criteria keywords
    if (criterionTitleLower.includes('ethical') || criterionTitleLower.includes('philosophy')) {
      const frameworks = ['utilitarian', 'deontolog', 'virtue ethic', 'kant', 'consequentialis'];
      const found = frameworks.filter(f => normalizedText.includes(f));
      matchedKeywords.push(...found);

      if (found.length >= 2) {
        scoreRatio = 0.95;
        strengths.push(`Identifies and contrasts multiple ethical traditions (${found.join(', ')}).`);
      } else if (found.length === 1) {
        scoreRatio = 0.75;
        strengths.push(`Introduces ${found[0]} reasoning.`);
        growthAreas.push('Incorporate at least a second distinct ethical framework for comparative contrast.');
      } else {
        scoreRatio = 0.35;
        growthAreas.push('Missing explicit philosophical framework terminology (e.g. Utilitarianism vs Deontology).');
      }
    } else if (criterionTitleLower.includes('technical') || criterionTitleLower.includes('protocol') || criterionTitleLower.includes('sgrna') || criterionTitleLower.includes('thesis')) {
      const technicalTerms = ['webmcp', 'modelcontext', 'prompt injection', 'security', 'autonomous', 'tool', 'cleavage', 'cas9', 'pam', 'hobsbawm', 'hartwell', 'standard of living'];
      const found = technicalTerms.filter(t => normalizedText.includes(t));
      matchedKeywords.push(...found);

      if (found.length >= 3) {
        scoreRatio = 0.92;
        strengths.push(`Demonstrates strong domain terminology integration (${found.slice(0, 3).join(', ')}).`);
      } else if (found.length >= 1) {
        scoreRatio = 0.75;
        strengths.push(`Touches on core subject concepts (${found.join(', ')}).`);
        growthAreas.push('Elaborate with deeper technical mechanics and concrete operational examples.');
      } else {
        scoreRatio = 0.40;
        growthAreas.push('Needs stronger grounding in course-specific methodologies and literature.');
      }
    } else if (criterionTitleLower.includes('governance') || criterionTitleLower.includes('human-in-the-loop') || criterionTitleLower.includes('cleavage') || criterionTitleLower.includes('sources')) {
      if (normalizedText.includes('human-in-the-loop') || normalizedText.includes('confirmation') || normalizedText.includes('mitigate') || normalizedText.includes('boundary') || normalizedText.includes('primary source')) {
        scoreRatio = 0.90;
        strengths.push('Offers a clear mitigation proposal and operational guardrails.');
      } else {
        scoreRatio = 0.55;
        growthAreas.push('Include a specific, step-by-step governance or control mechanism.');
      }
    } else {
      // General clarity / citations / structure
      if (wordCount >= 250 && (normalizedText.includes('##') || normalizedText.includes('introduction') || normalizedText.includes('conclusion'))) {
        scoreRatio = 0.90;
        strengths.push(`Well-organized structure with clear section headers (${wordCount} words).`);
      } else if (wordCount >= 100) {
        scoreRatio = 0.70;
        strengths.push(`Adequate length (${wordCount} words) with readable prose.`);
        growthAreas.push('Improve structural signposting using numbered headings or clear sub-sections.');
      } else {
        scoreRatio = 0.40;
        growthAreas.push('Draft is too brief to satisfy comprehensive academic standards.');
      }
    }

    const estimatedScore = Math.round(criterion.weightPoints * scoreRatio);
    totalScore += estimatedScore;

    // Pick matching level
    const sortedLevels = [...criterion.levels].sort((a, b) => b.score - a.score);
    let matchedLevel = sortedLevels[sortedLevels.length - 1];
    for (const lvl of sortedLevels) {
      if (estimatedScore >= (lvl.score * 0.85)) {
        matchedLevel = lvl;
        break;
      }
    }

    criteriaEvaluations.push({
      criterionId: criterion.id,
      criterionTitle: criterion.title,
      maxPoints: criterion.weightPoints,
      estimatedScore,
      performanceLevel: matchedLevel.label,
      strengths,
      growthAreas,
      matchedKeywords
    });

    if (growthAreas.length > 0) {
      actionableRecommendations.push(`[${criterion.title}]: ${growthAreas[0]}`);
    }
  }

  const percentageScore = Math.round((totalScore / rubric.totalPoints) * 100);

  let overallSummary = '';
  if (percentageScore >= 90) {
    overallSummary = `Outstanding draft! Scored ~${totalScore}/${rubric.totalPoints} (${percentageScore}%). Meets or exceeds exemplary criteria across major dimensions.`;
  } else if (percentageScore >= 75) {
    overallSummary = `Strong foundation (~${totalScore}/${rubric.totalPoints}, ${percentageScore}%). Key requirements are addressed, with clear opportunities for elevation in rubric alignment.`;
  } else {
    overallSummary = `Draft needs revision (~${totalScore}/${rubric.totalPoints}, ${percentageScore}%). Missing crucial conceptual depth and framework requirements.`;
  }

  return {
    rubricId: rubric.id,
    rubricTitle: rubric.title,
    totalPossiblePoints: rubric.totalPoints,
    totalEstimatedScore: totalScore,
    percentageScore,
    overallSummary,
    criteriaEvaluations,
    actionableRecommendations
  };
}

