// 因为会直接 script 导入 html，所以为了避免名称冲突，使用 Global 开头的命名空间
const GlobalConstant = {
    // 默认的模式
    DefaultMode: "default",

    // 默认样式的 ID 名
    DefaultStyleFlag: "TOY_READER_CONTAINER_CLASS",

    // 默认暗黑模式样式的 ID 名
    DefaultDarkStyleFlag: "TOY_READER_DARK_CLASS",

    // 默认暗黑模式样式的 Storage 的 key 值
    IsDarkModeKey: "IS_DARK_MODE"
}