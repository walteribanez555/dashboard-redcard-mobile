import { createPropertySelectors, createSelector } from "@ngxs/store";
import { CoverageState, CoverageStateModel } from "./coverage.state";

export class CoverageSelectors {
  static getSlices = createPropertySelectors<CoverageStateModel>(CoverageState);


  static getCoverages = createSelector(
    [CoverageSelectors.getSlices.coverages],
    (coverages) => coverages
  )

  static getCoverage = createSelector(
    [CoverageSelectors.getSlices.coverageById],
    (coverage) => coverage
  )

  static getStatus = createSelector(
    [CoverageSelectors.getSlices.status],
    (loading) => loading
  )
}
