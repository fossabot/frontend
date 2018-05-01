import getBuildPlan from './rollup.base';

export default getBuildPlan({
    enableUglify: false,
    withConsole: true,
    withSourceMap: true,
});
