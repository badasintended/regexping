const { Plugin } = require("powercord/entities");
const { inject, uninject } = require("powercord/injector");
const { getModule } = require("powercord/webpack");

const Settings = require("./Settings");

const regex = {
  newLine: /[^\r\n]+/g,
  meta: /^\/(.*?)\/([gimy]*)$/
};

module.exports = class RegexPing extends Plugin {
  async startPlugin() {
    const shouldNotify = await getModule(["makeTextChatNotification"]);
    const { default: MessageRender } = await getModule(["getElementFromMessageId"]);

    this.loadStylesheet("style.css");

    powercord.api.settings.registerSettings("regexping", {
      category: this.entityID,
      label: "Regex Ping",
      render: Settings,
    });

    const rules = this.settings
      .get("rules", "")
      .match(regex.newLine)
      .filter(line => regex.meta.test(line))
      .map(line => {
        const r = line.match(regex.meta);
        return new RegExp(r[1], r[2]);
      });

    inject("regexping$shouldNotify", shouldNotify, "shouldNotify", ([msg]) => {
      for (let i = 0; i < rules.length; i++) {
        if (rules[i].test(msg.content)) {
          return true;
        }
      }
    });

    inject("regexping$MessageRender", MessageRender, "type", args => {
      const [{ message }] = args;
      for (let i = 0; i < rules.length; i++) {
        if (rules[i].test(message.content)) {
          message.mentioned = true;
          break;
        }
      }
      return args;
    }, true);
  }

  pluginWillUnload() {
    uninject("regexping$shouldNotify");
    uninject("regexping$MessageRender");

    powercord.api.settings.unregisterSettings("regexping");
  }
};
