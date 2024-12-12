interface paginationObject {
    currentPage: number,
    limitTasks: number,
    skipTasks?: number,
    totalPages?: number
}
const paginationHelper = (query : Record<string, any>, paginationObject: paginationObject, countTasks: number) => {
    if (query.page) {
        paginationObject.currentPage = parseInt(query.page);
    }
    if (query.limit) {
        paginationObject.limitTasks = parseInt(query.limit);
    }
    paginationObject.skipTasks = (paginationObject.currentPage-1)*paginationObject.limitTasks;
    paginationObject.totalPages = Math.ceil(countTasks/paginationObject.limitTasks);
    return paginationObject;
}
export default paginationHelper;