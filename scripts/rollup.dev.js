import getBuildPlan from './rollup.base';

export default getBuildPlan({
    enableUglify: true,
    withSourceMap: true,
});
