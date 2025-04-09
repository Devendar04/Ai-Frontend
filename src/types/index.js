import { StepType, Step } from '../step.js';

/**
 * Modify a specific step's status.
 * @param {Array<Step>} steps - The list of steps.
 * @param {number} id - ID of the step to modify.
 * @param {'pending' | 'in-progress' | 'completed'} status - New status.
 * @returns {Array<Step>} Updated steps.
 */
export function updateStepStatus(steps, id, status) {
  return steps.map((step) =>
    step.id === id
      ? new Step(
          step.id,
          step.title,
          step.description,
          step.type,
          status,
          step.code,
          step.path
        )
      : step
  );
}

/**
 * Add a new step.
 * @param {Array<Step>} steps - The list of steps.
 * @param {Object} newStep - The new step to add.
 * @returns {Array<Step>} Updated steps.
 */
export function addStep(steps, newStep) {
  const stepInstance =
    newStep instanceof Step
      ? newStep
      : new Step(
          newStep.id,
          newStep.title,
          newStep.description,
          newStep.type,
          newStep.status,
          newStep.code,
          newStep.path
        );

  return [...steps, stepInstance];
}

/**
 * Remove a step by ID.
 * @param {Array<Step>} steps - The list of steps.
 * @param {number} id - ID of the step to remove.
 * @returns {Array<Step>} Updated steps.
 */
export function removeStep(steps, id) {
  return steps.filter((step) => step.id !== id);
}
