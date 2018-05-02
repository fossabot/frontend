import getBuildPlan from './rollup.base';

export default getBuildPlan({
    enableUglify: true,
    withConsole: true,
    withSourceMap: true,
});
