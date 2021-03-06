module.exports = {
  title: '亲子年货节商户后台',

  /**
   * @type {boolean} true | false
   * @description Whether show the settings right-panel
   */
  showSettings: true,

  /**
   * @type {boolean} true | false
   * @description Whether need tagsView
   */
  tagsView: true,

  /**
   * @type {boolean} true | false
   * @description Whether fix the header
   */
  fixedHeader: false,

  /**
   * @type {boolean} true | false
   * @description Whether show the logo in sidebar
   */
  sidebarLogo: false,

  /**
   * @type {string | array} 'production' | ['production', 'development']
   * @description Need show err logs component.
   * The default is only used in the production env
   * If you want to also use it in dev, you can pass ['production', 'development']
   */
  errorLog: 'production',

  SERVICE_HOST: 'https://wechat.mamayy.com/mother',
  UPLOAD_URL: 'https://wechat.mamayy.com/mother/uploadUrl',
  USER_STORAGE_KEY: 'user_info',

  DEFAULT_USER_NAME: '管理员',
  DEFAULT_USER_AVATAR: '@/assets/user_images/avatar.jpg'

}
