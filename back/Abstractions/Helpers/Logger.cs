﻿using Microsoft.Extensions.Logging;
using System.Runtime.CompilerServices;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace SousMarinJaune.Api.Abstractions.Helpers;

public static class Log
{
    private static readonly JsonSerializerOptions options = new JsonSerializerOptions()
    {
        Converters =
        {
            new JsonStringEnumConverter()
        }
    };

    public static string Format(object? value, [CallerArgumentExpression("value")] string name = "")
    {
        return $"{name}={JsonSerializer.Serialize(value, options)}";
    }


    public static LoggerInstance<T> Enter<T>(this ILogger<T> logger, string arguments = "", LogLevel level = LogLevel.Debug, [CallerMemberName] string method = "")
    {
        var loggerInstance = new LoggerInstance<T>(logger, method, arguments, level);

        loggerInstance.Enter();

        return loggerInstance;
    }


    public class LoggerInstance<T>
    {
        private readonly string _arguments;
        private readonly string _method;
        private readonly ILogger<T> _logger;
        private readonly LogLevel _level;

        public LoggerInstance(ILogger<T> logger, string method,  string arguments, LogLevel level)
        {
            this._arguments = arguments;
            this._level = level;
            this._method = method;
            this._logger = logger;
        }

        public void Enter()
        {
            if (!_logger.IsEnabled(_level)) return;
            
            var sb = new StringBuilder($"Entering method {_method}");
            if (_arguments?.Length > 0)
            {
                sb.Append($": {_arguments}");
            }
            _logger.Log(_level, sb.ToString());
        }


        public void Exit()
        {
            if (!_logger.IsEnabled(_level)) return;
            
            var sb = new StringBuilder($"Exiting method {_method}");
            if (_arguments?.Length > 0)
            {
                sb.Append($": {_arguments}");
            }
            _logger.Log(_level, sb.ToString());
            _logger.Log(_level, _arguments);
        }


    }
}